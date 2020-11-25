import firebase, { firestore } from "../firebase";
import { validateEmail, validatePassword } from "./authentication";
import { getPostsByUserId } from "./blog";

// Represents the object returned from an async API function. All async API functions will return a Promise with this object.
export interface ReturnObject<DataType> {
	data?: DataType;
	message: string;
}

// Represents a User in the firestore database. Also includes the optional uid property (added during api requests)
export interface DatabaseUser {
	uid?: string;
	email: string;
	displayName: string;
	posts?: string[];
}

// Represents a user object from firebase authenticaion with the addition of the isAdmin property.
type IsAdmin = { isAdmin?: boolean };
export interface BluffsUser extends IsAdmin, firebase.User {}

export interface FSAdminsCollection {
	[key: string]: true;
}

export type CollectionReference = firebase.firestore.CollectionReference;
export type DocumentReference = firebase.firestore.DocumentReference;
export type DocumentSnapshot = firebase.firestore.DocumentSnapshot;
export type DocumentData = firebase.firestore.DocumentData;
export type QuerySnapshot = firebase.firestore.QuerySnapshot;
type APIReturn<DataType> = Promise<ReturnObject<DataType>>;

const APIReturn = Promise;
const FieldPath = firebase.firestore.FieldPath;
const FieldValue = firebase.firestore.FieldValue;

/**
 * Retrieves a user document from the firestore database based on a given id
 *
 * @param id {string} - an id corresponding to the user document to retrieve
 * @returns {APIReturn<DocumentData>} a Promise containing the document data and a success message
 */
export const getUserById = async (id: string): APIReturn<DatabaseUser> => {
	try {
		const userSnapshot: DocumentSnapshot = await firestore
			.collection("users")
			.doc(id)
			.get();

		const userData = userSnapshot.data() as DatabaseUser;
		return {
			data: userData,
			message: "success",
		};
	} catch (e) {
		console.log("Error from 'getUserbyId' function in 'users.ts'", e);
		throw e;
	}
};

/**
 * Retrieves a set of user documents matching an array of given ids.
 *
 * @param ids {string[]} - an array of ids, each corresponding to the documentID of a matching User in the firestore database.
 * @returns {APIReturn<DatabaseUser[]>} a Promise containing an array of DatabaseUser objects and a success message.
 */
export const getUsersByIds = async (
	ids: string[]
): APIReturn<DatabaseUser[]> => {
	try {
		const usersMatchingIds = await firestore
			.collection("users")
			.where(FieldPath.documentId(), "in", ids)
			.get();
		let result: DatabaseUser[] = [];
		usersMatchingIds.forEach((user: DocumentSnapshot) => {
			const userData: DatabaseUser = user.data() as DatabaseUser;
			result.push({
				uid: user.id,
				...userData,
			});
		});

		return {
			message: "success",
			data: result,
		};
	} catch (e) {
		console.log("Error from 'getUsersByIds' function in 'users.ts'", e);
		throw e;
	}
};

/**
 * Searches for a user matching a given email string
 *
 * @param email {string} - an email with which to search for a matching user
 * @returns {APIReturn<DatabaseUser>} a Promise containing the DatabaseUser object matching the given email and a success message
 */
export const searchForUserByEmail = async (
	email: string
): APIReturn<DatabaseUser> => {
	try {
		const usersMatchingEmail = await firestore
			.collection("users")
			.where("email", "==", email)
			.get();
		let result: DatabaseUser | null = null;
		usersMatchingEmail.forEach((user: DocumentSnapshot) => {
			if (result) {
				throw Error("Multiple users with the same email");
			}
			const userData = user.data() as DatabaseUser;
			result = {
				uid: user.id,
				...userData,
			};
		});

		if (!result) {
			throw Error("No user with that email was found");
		}
		return {
			message: "success",
			data: result,
		};
	} catch (e) {
		console.log("Error from 'serachForUserByEmail' in 'users.ts'", e);
		throw e;
	}
};

/**
 * Adds a the currently signed in user to the firestore database. You must still add the displayName property
 * to the firebase authentication database in a separate function.
 *
 * @param email {string} the email of the user to add to the firestore database
 * @param firstName {string} the first name of the user to add to the firestore database
 * @param lastName {string} the last name of the user to add to the firestore database
 * @returns {APIReturn<DocumentReference>} a Promise containing the DocumentReference for the user document just created and a success message.
 */
export const addUserToFirestore = async (
	email: string,
	firstName: string,
	lastName: string
): APIReturn<null> => {
	try {
		const currentUser = firebase.auth().currentUser;
		if (!currentUser) {
			throw Error("No user signed in while trying to add to firestore");
		}

		await firestore
			.collection("users")
			.doc(currentUser.uid)
			.set({
				email: email,
				displayName: `${firstName} ${lastName}`,
			});

		return {
			message: "success",
			data: null,
		};
	} catch (e) {
		console.log("Error from 'addUserToFirestore' in 'users.ts'", e);
		throw e;
	}
};

/**
 * Adds a user to the admins document in firesbase. This makes that user an admin.
 *
 * @param id {string} the id of the user to add to the admins doc in firestore
 * @returns {APIReturn<DocumentReference} a Promise containing the DocumentReference of the admin document and a success message
 */
export const addUserToAdmins = async (id: string): APIReturn<null> => {
	try {
		await firestore
			.collection("users")
			.doc("admins")
			.update({
				[id]: true,
			});
		return {
			message: "success",
			data: null,
		};
	} catch (e) {
		console.log("Error from 'addUserToAdmins' in 'users.ts'", e);
		throw e;
	}
};

/**
 * Removes a user from the admin document in firestore. This makes the user no longer an admin.
 *
 * @param id {string} the id of the user to remove
 * @returns {APIReturn<DocumentReference>} a Promise containing the DocumentReference of the admins document and a success message
 */
export const removeUserFromAdmins = async (id: string): APIReturn<null> => {
	try {
		await firestore
			.collection("users")
			.doc("admins")
			.update({
				[id]: FieldValue.delete(),
			});
		return {
			message: "success",
			data: null,
		};
	} catch (e) {
		console.log("Error from 'removeUserFromAdmins' in 'users.ts'", e);
		throw e;
	}
};

/**
 * Gets the admins document from the firestore database.
 *
 * @returns {APIReturn<FSAdminsCollection>} a Promise containing the admins document from the firestore database and a success message
 */
export const getAdmins = async (): APIReturn<FSAdminsCollection> => {
	try {
		const admins: DocumentSnapshot = await firestore
			.collection("users")
			.doc("admins")
			.get();
		return {
			message: "success",
			data: admins.data() as FSAdminsCollection,
		};
	} catch (e) {
		console.log("Error from 'getAdmins' in 'users.ts'", e);
		throw e;
	}
};

/**
 * Adds a post to the user object in firestore. This allows querying of posts from a user document.
 *
 * @param uid {string} the id of the user that wrote the post to add to their object
 * @param postId {string} the id of the post the user just wrote
 * @returns {APIReturn<DocumentReference>} a Promise containing the DocumentReference for the user passed in and a success message
 */
export const addPostToUserObject = async (
	uid: string,
	postId: string
): APIReturn<null> => {
	try {
		await firestore
			.collection("users")
			.doc(uid)
			.update({
				posts: FieldValue.arrayUnion(postId),
			});
		return {
			message: "success",
			data: null,
		};
	} catch (e) {
		console.log("Error from 'addPostToUserObject' in 'users.ts'", e);
		throw e;
	}
};

/**
 * Removes a post from a user object in firestore. Should only be called when the post is deleted.
 *
 * @param uid {string} the id of the user to remove the post from
 * @param postId {string} the id of the post to remove from the user object
 * @returns {APIReturn<DocumentReference>} a Promise containing the DocumentReference for the user passed in and a success message
 */
export const removePostFromUserObject = async (
	uid: string,
	postId: string
): APIReturn<null> => {
	try {
		await firestore
			.collection("users")
			.doc(uid)
			.update({
				posts: FieldValue.arrayRemove(postId),
			});
		return {
			message: "success",
			data: null,
		};
	} catch (e) {
		console.log("Error from 'removePostFromUserObject' in 'users.ts'", e);
		throw e;
	}
};

export const updateUserValues = async (
	propertyName: string,
	value: string
): APIReturn<null> => {
	try {
		switch (propertyName) {
			case "displayName":
				return await updateName(value);
			case "email":
				return await updateEmail(value);
			case "password":
				return await updatePassword(value);
			default:
				throw Error(
					"We couldn't find what you wanted to change. Try logging out then back in."
				);
		}
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const updateName = async (value: string) => {
	try {
		const currentUser = firebase.auth().currentUser;
		if (!currentUser) {
			throw Error("Please sign in.");
		}

		await currentUser.updateProfile({
			displayName: value,
		});
		await firestore.collection("users").doc(currentUser.uid).update({
			displayName: value,
		});

		const apiReturn = await getPostsByUserId(currentUser.uid);
		if (apiReturn.message[0] === "E" || !apiReturn.data) {
			throw Error(apiReturn.message);
		}
		const posts = apiReturn.data;

		const batch = firestore.batch();
		for (const post of posts) {
			const postRef = firestore.collection("posts").doc(post.postId);
			batch.update(postRef, { authorName: value });
		}
		await batch.commit();

		return {
			message: `Success! The property was changed.`,
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const updateEmail = async (value: string) => {
	try {
		validateEmail(value);
		const currentUser = firebase.auth().currentUser;
		if (!currentUser) {
			throw Error("Please sign in.");
		}

		await currentUser.updateEmail(value);
		await firestore.collection("users").doc(currentUser.uid).update({
			email: value,
		});
		return {
			message: `Success! The property was changed.`,
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const updatePassword = async (value: string) => {
	try {
		validatePassword(value);
		const currentUser = firebase.auth().currentUser;
		if (!currentUser) {
			throw Error("Please sign in.");
		}

		await currentUser.updatePassword(value);
		return {
			message: `Success! The property was changed.`,
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const setMemberCodeListener = (onChange: (code: string) => void) => {
	firestore
		.collection("users")
		.doc("memberCode")
		.onSnapshot((docSnapshot: DocumentSnapshot) => {
			const data = docSnapshot.data();
			if (!data) {
				return;
			}
			const memberCode = data.value;
			onChange(memberCode);
		});
};

export const changeMemberCode = async (code: string): APIReturn<null> => {
	try {
		await firestore.collection("users").doc("memberCode").set({
			value: code,
		});

		return {
			message: "Success. Member code value has been changed.",
			data: null,
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const deleteAccountByUid = async (uid: string) => {
	try {
		const user = firebase.auth().currentUser;
		await user!.delete();
		await firestore.collection("users").doc(uid).delete();

		return {
			message: "Success. User has been deleted from the system.",
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};
