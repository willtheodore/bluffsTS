import firebase, { firestore } from "../firebase"

export function getUserById(id) {
  return new Promise((resolve, reject) => {
    const users = firestore.collection("users")

    users.doc(id).get()
    .then(user => resolve(user.data()))
    .catch(err => reject(err.message))
  })
}

export function getUsersByIds(ids) {
  const filterById = user => {
    for (const id of ids) {
      if (user.id === id) {
        return true
      }
    }
    return false
  }

  return new Promise((resolve, reject) => {
    firestore.collection("users").get()
    .then(users => {
      let result = {}
      users.forEach(user => {
        if (filterById(user)) {
          result = {
            [user.id]: user.data(),
            ...result
          }
        }
      })
      resolve(result)
    })
    .catch(err => {
      console.log("Error getting users by id", err)
      reject(err)
    })
  })
}

export function searchUserByEmail(email) {
  return new Promise((resolve, reject) => {
    firestore.collection("users").where("email", "==", email).get()
    .then(users => {
      let result = null
      users.forEach(user => {
        if (result) { reject("fail") }
        result = {
          id: user.id,
          ...user.data()
        }
      })
      resolve({ message: `We were able to find ${result.displayName} in the database. Add as admin?`, data: result})
    })
    .catch(err => reject("fail"))
  })
}

export function addUserToFirestore(email, firstName, lastName) {
  return new Promise((resolve, reject) => {
    const user = firebase.auth().currentUser
    if (!user) { reject("No one is signed in") }

    firestore.collection("users").doc(user.uid).set({
      email: email,
      displayName: `${firstName} ${lastName}`
    })
    .then(success => resolve("success"))
    .catch(err => reject(err.message))
  })
}

export function addUserToAdmins(id) {
  return new Promise((resolve, reject) => {
    firestore.collection("users").doc("admins").update({
      [id]: true
    })
    .then(success => resolve("Success! User is now an Admin."))
    .catch(err => reject(err.message))
  })
}

export function removeUserFromAdmins(id) {
  return new Promise((resolve, reject) => {
    firestore.collection("users").doc("admins").update({
      [id]: firebase.firestore.FieldValue.delete()
    })
    .then(success => resolve("Success! User is no longer an Admin."))
    .catch(err => reject(err.message))
  })
}

export function determineIfAdmin(user, admins) {
  if (user && admins) {
    if (admins[user.uid]) { return true }
  }
  return false
}

export function getAdmins() {
  return new Promise((resolve, reject) => {
    firestore.collection("users").doc("admins").get()
    .then(admins => resolve(admins.data()))
    .catch(err => reject(err.message))
  })
}

export function addPostToUserObject(user, postId) {
  return new Promise((resolve, reject) => {
    if (postId) {
      firestore.collection("users").doc(user.uid).update({
        posts: firebase.firestore.FieldValue.arrayUnion(postId)
      })
      .then(success => resolve("success"))
    } else {
      reject("ID was null")
    }
  })
}

export function removePostFromUserObject(user, postId) {
  return new Promise((resolve, reject) => {
    if (user && postId) {
      const uid = user.uid
      firestore.collection("users").doc(uid).update({
        posts: firebase.firestore.FieldValue.arrayRemove(postId)
      })
      .then(success => resolve("success"))
      .catch(err => reject(err.message))
    } else {
      reject("User or Post Id is null")
    }
  })
}
