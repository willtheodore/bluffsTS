import * as _ from "lodash";
import firebase, { firestore } from "../firebase";
import { formatPosts } from "./formatters";
import {
	DocumentReference,
	DocumentSnapshot,
	QuerySnapshot,
	ReturnObject,
} from "./users";

export interface FSComment {
	author: string;
	authorName: string;
	content: string;
	datePosted: Timestamp;
	formattedDate?: string;
}
export interface FSPost {
	author: string;
	authorName: string;
	title: string;
	content: string;
	datePosted: Timestamp;
	month: number;
	year: number;
	formattedDate?: string;
	postId?: string;
	comments?: FSCommentCollection;
}

export type FSCommentCollection = { [key: string]: FSComment };
export type PostsHandler = (posts: FSPost[]) => any;
export type PostHandler = (post: FSPost) => any;
export type Timestamp = firebase.firestore.Timestamp;
type APIReturn<DataType> = Promise<ReturnObject<DataType>>;

const APIReturn = Promise;
const FieldPath = firebase.firestore.FieldPath;
const FieldValue = firebase.firestore.FieldValue;

/**
 * Gets a post from firestore based on a passed ID
 *
 * @param id {string} the id of the post to fetch
 * @returns {APIReturn<FSPost>} a Promise containing a firestore Post object corresponding to the passed ID and a success message
 */
export const getPostById = async (id: string): APIReturn<FSPost> => {
	try {
		const post = await firestore.collection("posts").doc(id).get();
		const postData = post.data() as FSPost;
		return {
			message: "success",
			data: {
				postId: post.id,
				...postData,
			},
		};
	} catch (e) {
		console.log("Error from 'getPostById' in 'blog.ts'", e);
		throw e;
	}
};

/**
 * Gets all posts matching an array of ids
 *
 * @param ids {string[]} an array of ids corresponding to the documents to retrieve
 * @returns {APIReturn<FSPost[]>} a Promise containing an array of FSPosts matching the ids
 */
export const getPostsByIds = async (ids: string[]): APIReturn<FSPost[]> => {
	try {
		const posts = await firestore
			.collection("posts")
			.where(FieldPath.documentId(), "in", ids)
			.get();
		let result: FSPost[] = [];
		posts.forEach((post: DocumentSnapshot) => {
			result.push({
				postId: post.id,
				...post.data(),
			} as FSPost);
		});
		return {
			message: "success",
			data: result,
		};
	} catch (e) {
		console.log("Error from 'getPostsByIds' in 'blog.ts'", e);
		throw e;
	}
};

/**
 * Deletes a post matching a given ID
 *
 * @param id {string} the id of the post to delete
 * @returns {APIReturn<null>} a Promise containing a success message
 */
export const deletePostById = async (id: string): APIReturn<null> => {
	try {
		await firestore.collection("posts").doc(id).delete();
		return { message: "success", data: null };
	} catch (e) {
		console.log("Error from 'deletePostById' in 'blog.ts'", e);
		throw e;
	}
};

/**
 * Sets a listener that fires everytime theres an update to the post with a matching passed ID
 *
 * @param id {string} the id of the post to set a listener on
 * @param handlePost {PostHandler} a callback function that gets passed the post listened to each time theres an update
 * @returns {VoidFunc} an unsubscriber. Call to stop the subscription.
 */
export const setPostListenerById = (
	id: string,
	handlePost: PostHandler
): VoidFunction => {
	const unsubscribe = firestore
		.collection("posts")
		.doc(id)
		.onSnapshot((doc: DocumentSnapshot) => {
			handlePost({
				postId: doc.id,
				...doc.data(),
			} as FSPost);
		});
	return unsubscribe;
};

/**
 * Sets a listener that fires any time any post with a matching ID changes
 *
 * @param ids {string[]} an array of ids corresponding to the posts to set listeners on
 * @param handlePosts {PostsHandler} a callback function that is fired any time theres an update on any of the posts with an id in the passed array
 * @returns {VoidFunc} an unsubscriber. Call to stop the subscriptions.
 */
export const setPostListenerByIds = (
	ids: string[],
	handlePosts: PostsHandler
): VoidFunction => {
	const unsubscriber = firestore
		.collection("posts")
		.where(firebase.firestore.FieldPath.documentId(), "in", ids)
		.onSnapshot((posts: QuerySnapshot) => {
			let result: FSPost[] = [];
			posts.forEach((post: DocumentSnapshot) => {
				const postData = post.data() as FSPost;
				const formattedPost = formatPosts([postData])[0];
				result.push({
					postId: post.id,
					...formattedPost,
				});
			});
			result = _.sortBy(result, ["datePosted"]);
			_.reverse(result);
			handlePosts(result);
		});
	return unsubscriber;
};

/**
 * Gets the {quantity} most recent posts
 *
 * @param quantity {number} the number of recent post to retrieve
 * @returns {APIReturn<FSPost[]>} a Promise containing an array of the {quantity} most recent posts and a success message
 */
export const getRecentPosts = async (quantity: number): APIReturn<FSPost[]> => {
	try {
		let result: FSPost[] = [];
		const posts = await firestore
			.collection("posts")
			.orderBy("datePosted", "desc")
			.limit(quantity)
			.get();
		posts.forEach((post: DocumentSnapshot) => {
			result.push({
				postId: post.id,
				...post.data(),
			} as FSPost);
		});
		return {
			message: "success",
			data: result,
		};
	} catch (e) {
		console.log("Error from 'getRecentPosts' in 'blog.ts'", e);
		throw e;
	}
};

/**
 * Updates the title and content for a given post ID
 *
 * @param postId {string} the id of the post to update
 * @param title {string} the new title for the post
 * @param content {string} the new content for the post
 * @returns {APIReturn<DocumentReference>} a Promise containing the document reference for the post and a success message
 */
export const updatePostTitleAndContent = async (
	postId: string,
	title: string,
	content: string
): APIReturn<null> => {
	try {
		await firestore.collection("posts").doc(postId).update({ title, content });
		return {
			message: "success",
			data: null,
		};
	} catch (e) {
		console.log("Error from 'updatePostTitleAndContent' in 'blog.ts'", e);
		throw e;
	}
};

/**
 * Adds a new post to the firebase system.
 *
 * @param uid {string} the id of the user writing the post
 * @param displayName {string} the display name of the user writing the post
 * @param timestamp {Date} a JS Date representing the time the post was written
 * @param title {string} the title for the post
 * @param content {string} the content of the post
 * @returns {APIReturn<DocumentReference>} a Promise conaining the document reference of the new post and a success message
 */
export const addNewPost = async (
	uid: string,
	displayName: string,
	timestamp: Date,
	title: string,
	content: string
): APIReturn<DocumentReference> => {
	try {
		const docRef = await firestore.collection("posts").add({
			author: uid,
			authorName: displayName,
			title: title,
			content: content,
			datePosted: timestamp,
			month: timestamp.getMonth(),
			year: timestamp.getFullYear(),
		});
		return { message: "success", data: docRef };
	} catch (e) {
		console.log("Error from 'addNewPost' in 'blog.ts'", e);
		throw e;
	}
};

/**
 * Posts a comment by updating the document for the correpsonding post
 *
 * @param postId {string} the id of the post where the comment was posted
 * @param uid {string} the id of the user that wrote the comment
 * @param displayName {string} the display name of the user that wrote the comment
 * @param timestamp {Date} the time the comment was posted
 * @param content {string} the content of the post
 * @param comments {FSCommentCollection | null} the comments that have been previously posted on this post
 * @returns {APIReturn<DocumentReference>} a Promise containing the document reference for the post and a success message
 */
export const postComment = async (
	postId: string,
	uid: string,
	displayName: string,
	timestamp: Date,
	content: string,
	comments: FSCommentCollection | null
): APIReturn<null> => {
	try {
		await firestore
			.collection("posts")
			.doc(postId)
			.update({
				comments: {
					[timestamp.getTime().toString()]: {
						author: uid,
						authorName: displayName,
						datePosted: timestamp,
						content: content,
					},
					...comments,
				},
			});
		return { message: "success", data: null };
	} catch (e) {
		console.log("Error from 'postComment' in 'blog.ts'", e);
		throw e;
	}
};

/**
 * Deletes a comment from a post based on its ID.
 *
 * @param postId {string} the id of the post where the comment was posted
 * @param commentId {string} the id of the comment to delete
 * @returns {APIReturn<DocumentReference>} a Promise containing the document reference for the post and a success message
 */
export const deleteCommentById = async (
	postId: string,
	commentId: string
): APIReturn<null> => {
	try {
		await firestore
			.collection("posts")
			.doc(postId)
			.update({
				[`comments.${commentId}`]: FieldValue.delete(),
			});
		return { message: "success", data: null };
	} catch (e) {
		console.log("Error from 'deleteCommentById' in 'blog.ts'", e);
		throw e;
	}
};

export const getPostsByDate = async (
	month: string,
	year: number
): APIReturn<FSPost[]> => {
	try {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const monthNum = months.indexOf(month);
		if (monthNum < 0) {
			throw Error("Invalid month");
		}
		const posts = await firestore
			.collection("posts")
			.where("month", "==", monthNum)
			.where("year", "==", year)
			.get();
		let result: FSPost[] = [];
		posts.forEach((post: DocumentSnapshot) => {
			const postData = post.data() as FSPost;
			result.push({
				postId: post.id,
				...postData,
			});
		});
		result = _.sortBy(result, ["datePosted"]);
		_.reverse(result);
		return {
			message: "success",
			data: result,
		};
	} catch (e) {
		console.log("Error from 'getPostsByDate' in 'blog.ts'", e);
		throw e;
	}
};

export const getPostsByUserId = async (id: string): APIReturn<FSPost[]> => {
	try {
		const query = await firestore
			.collection("posts")
			.where("author", "==", id)
			.get();
		let result: FSPost[] = [];
		query.forEach((post: DocumentSnapshot) => {
			const postData = post.data() as FSPost;
			result.push({
				postId: post.id,
				...postData,
			});
		});

		return {
			message: `Success. Posts from author with id ${id} have been returned.`,
			data: result,
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};
