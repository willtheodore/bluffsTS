import _ from "lodash"
import firebase, { firestore } from "../firebase"
import { formatDateForDescription } from "./formatters"

// Returns a promise containing a JSON object containing the data for a single post document
// that matches the document ID passed to the function. A rejected result contains the error.
export function retrievePostById(id) {
  return new Promise((resolve, reject) => {
    firestore.collection("posts").doc(id).get()
    .then(doc => {
      resolve({
        postId: doc.id,
        ...doc.data()
      })
    })
    .catch(err => {
      console.log("Error retrieiving posts", err)
      reject(err)
    })
  })
}

export function getPostsByIds(ids) {
  return new Promise((resolve, reject) => {
    let promises = []
    for (const id of ids) {
      promises.push(retrievePostById(id))
    }
    Promise.all(promises)
    .then(posts => (filterNullValues(posts)))
    .then(posts => resolve(posts))
    .catch(err => reject(err.message))
  })
}

function filterNullValues(arrayOfObjects) {
  let result = []
  for (const object of arrayOfObjects) {
    if (object) {
      let clean = true
      for (const key in object) {
        if (!object[key]) { clean = false }
      }
      if (clean) { result.push(object) }
    }
  }
  return result
}

export function deletePostById(id) {
  return new Promise((resolve, reject) => {
    firestore.collection("posts").doc(id).delete()
    .then(success => resolve("success"))
    .catch(err => reject(err.message))
  })
}

export function setPostListenerById(id, handlePost, post) {
  const unsubscribe = firestore.collection("posts").doc(id).onSnapshot(doc => {
    handlePost({
      postId: doc.id,
      ...doc.data()
    })
  })
  return unsubscribe
}

export function setPostListenerByIds(ids, setPosts) {
  const unsubscriber = firestore.collection("posts").where(firebase.firestore.FieldPath.documentId(),"in", ids)
  .onSnapshot(posts => {
    let result = []
    posts.forEach(post => {
      const formattedPost = formatPosts([post.data()])[0]
      result.push({
        postId: post.id,
        ...formattedPost
      })
    })
    result = _.sortBy(result, ["datePosted"])
    _.reverse(result)
    setPosts(result)
  })
  return unsubscriber
}

// Returns a promise containing an array of JSON objects where each object represents a recent post
// Specify how many recent posts you would like in the params. A rejected result contains the error.
export function getRecentPosts(number) {
  return new Promise((resolve, reject) => {
    let result = new Array()
    const posts = firestore.collection("posts")

    posts.orderBy("datePosted", "desc").limit(number).get()
    .then(docRefs => {
      docRefs.forEach(post => {
        const data = post.data()
        result.push({
          ...data,
          postId: post.id
        })
      })
      resolve(result)
    })
    .catch(err => reject(err))
  })
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
