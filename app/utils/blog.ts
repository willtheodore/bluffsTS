import * as _ from "lodash"
import firebase, { firestore } from "../firebase.js"
import { formatDateForDescription } from "./formatters.js"
import { DocumentSnapshot, QuerySnapshot, ReturnObject } from "./users.js"

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
  postId?: string;
  comments?: { [key: string]: FSComment }
}

export type PostsHandler = (posts: FSPost[]) => any
export type PostHandler = (post: FSPost) => any
export type VoidFunc = () => void
export type Timestamp = firebase.firestore.Timestamp
type APIReturn<DataType> = Promise<ReturnObject<DataType>>

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
    const post = await firestore.collection("posts").doc(id).get()
    return {
      message: "success",
      data: {
        postId: post.id,
        ...post.data()
      }
    }
  } catch (e) {
    console.log("Error from 'getPostById' in 'blog.ts'", e)
    throw e
  }
}

/**
 * Gets all posts matching an array of ids
 * 
 * @param ids {string[]} an array of ids corresponding to the documents to retrieve
 * @returns {APIReturn<FSPost[]>} a Promise containing an array of FSPosts matching the ids
 */
export const getPostsByIds = async (ids: string[]): APIReturn<FSPost[]> => {
  try {
    const posts = await firestore.collection("posts").where(FieldPath.documentId(), "in", ids).get()
    let result: FSPost[] = []
    posts.forEach((post: DocumentSnapshot) => {
      result.push({
        postId: post.id,
        ...post.data()
      } as FSPost)
    })
    return {
      message: "success",
      data: result
    }
  } catch (e) {
    console.log("Error from 'getPostsByIds' in 'blog.ts'", e)
    throw e
  }
}

/**
 * Deletes a post matching a given ID
 * 
 * @param id {string} the id of the post to delete
 * @returns {APIReturn<null>} a Promise containing a success message
 */
export const deletePostById = async (id: string): APIReturn<null> => {
  try {
    await firestore.collection("posts").doc(id).delete()
    return { message: "success", data: null }
  } catch (e) {
    console.log("Error from 'deletePostById' in 'blog.ts'", e)
    throw e
  }
}

/**
 * Sets a listener that fires everytime theres an update to the post with a matching passed ID
 * 
 * @param id {string} the id of the post to set a listener on
 * @param handlePost {PostHandler} a callback function that gets passed the post listened to each time theres an update
 * @returns {VoidFunc} an unsubscriber. Call to stop the subscription.
 */
export const setPostListenerById = (id: string, handlePost: PostHandler): VoidFunc =>  {
  const unsubscribe = firestore.collection("posts").doc(id).onSnapshot((doc: DocumentSnapshot) => {
    handlePost({
      postId: doc.id,
      ...doc.data()
    } as FSPost )
  })
  return unsubscribe
}

/**
 * Sets a listener that fires any time any post with a matching ID changes
 * 
 * @param ids {string[]} an array of ids corresponding to the posts to set listeners on
 * @param handlePosts {PostsHandler} a callback function that is fired any time theres an update on any of the posts with an id in the passed array
 * @returns {VoidFunc} an unsubscriber. Call to stop the subscriptions.
 */
export const setPostListenerByIds = (ids: string[], handlePosts: PostsHandler): VoidFunc => {
  const unsubscriber = firestore.collection("posts").where(firebase.firestore.FieldPath.documentId(),"in", ids)
  .onSnapshot((posts: QuerySnapshot) => {
    let result: FSPost[] = []
    posts.forEach((post: DocumentSnapshot) => {
      const formattedPost = formatPosts([post.data()])[0]
      result.push({
        postId: post.id,
        ...formattedPost
      })
    })
    result = _.sortBy(result, ["datePosted"])
    _.reverse(result)
    handlePosts(result)
  })
  return unsubscriber
}

/**
 * Gets the {quantity} most recent posts
 *  
 * @param quantity {number} the number of recent post to retrieve
 * @returns {APIReturn<FSPost[]>} a Promise containing an array of the {quantity} most recent posts and a success message
 */
const getRecentPosts = async (quantity: number): APIReturn<FSPost[]> => {
  try {
    let result: FSPost[] = []
    const posts = await firestore.collection("posts").orderBy("datePost", "desc").limit(quantity).get()
    posts.forEach((post: DocumentSnapshot) => {
      result.push({
        postId: post.id,
        ...post.data()
      } as FSPost)
    })
    return {
      message: "success",
      data: result
    }
  } catch (e) {
    console.log("Error from 'getRecentPosts' in 'blog.ts'", e)
    throw e
  }
}

export function updatePostTitleAndContent(postId, title, content) {
  return new Promise((resolve, reject) => {
    firestore.collection("posts").doc(postId).update({
      title: title,
      content: content,
    })
    .then(docRef => resolve(docRef))
    .catch(err => reject(err.message))
  })
}

export function formatPosts(posts) {
  let result = posts.slice()
  for (const post of result) {
    if (post) {
      post.formattedDate = formatDateForDescription(post.datePosted)
    }
  }
  return result
}

export function addNewPost(uid, displayName, timestamp, title, content) {
  return new Promise((resolve, reject) => {
    firestore.collection("posts").add({
      author: uid,
      authorName: displayName,
      title: title,
      content: content,
      datePosted: timestamp,
      month: timestamp.getMonth(),
      year: timestamp.getYear(),
    })
    .then(docRef => resolve(docRef))
    .catch(err => reject(err.message))
  })
}

export function postComment({ postId, uid, displayName, timestamp, content, comments = null }) {
  return new Promise((resolve, reject) => {
    const newCommentKey = timestamp.getTime().toString()
    firestore.collection("posts").doc(postId).update({
      comments: {
        [newCommentKey]: {
          "author": uid,
          "authorName": displayName,
          "datePosted": timestamp,
          "content": content,
        },
        ...comments
      }
    })
    .then(docRef => resolve(docRef))
    .catch(err => reject(err.message))
  })
}

export function deleteCommentById(postId, id, comments) {
  return new Promise((resolve, reject) => {
    const oldCommentKey = `comments.${id}`
    firestore.collection("posts").doc(postId).update({
      [oldCommentKey]: firebase.firestore.FieldValue.delete()
    })
    .then(docRef => resolve(docRef))
    .catch(err => reject(err.message0))
  })
}

// Returns a promise containing all matching posts in a given month and year. A rejected result contains
// the error.
export function getPostsByDate(month, year) {
  return new Promise((resolve, reject) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthNum = months.indexOf(month)
    if (monthNum < 0) { reject("Invalid month") }
    let result = new Array()
    firestore.collection("posts")
    .where("month", "==", monthNum)
    .where("year", "==", (year - 2000 + 100))
    .get()
    .then(posts => {
      posts.forEach(post => {
        let postData = post.data()
        result.push({
          postId: post.id,
          ...postData
        })
      })
      debugger;
      result = _.sortBy(result, ["datePosted"])
      _.reverse(result)
      resolve(result)
    })
    .catch(err => reject(err.message))
  })
}
