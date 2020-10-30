import firebase from "../firebase"

const expandedChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                       'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
                       'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4',
                       '5', '6', '7', '8', '9', '0', '?', '!', '\'', '+',
                       '@', '#', '$', '%', '^', '&', '*', '_', '-', '=',
                       '/', '|']

const narrowChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                     'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
                     'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4',
                     '5', '6', '7', '8', '9', '0', '-']

function checkCharacters(validChars, string) {
  const token = string.toLowerCase()
  for (let i = 0; i < token.length; i++) {
    const char = validChars.find(element => element === token[i])
    if (char === undefined) { return false }
  }
  return true
}

export function signOut() {
  return new Promise((resolve, reject) =>  {
    firebase.auth().signOut()
    .then(() => resolve("success signing out"))
    .catch(err => {
      console.log("Error signing out: ", err.message)
      reject(err)
    })
  })
}

export function signInUser(email, password) {
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => resolve("success signing in"))
    .catch(err => {
      console.log("Error signing in: ", err.message)
      reject(err.message)
    })
  })
}

export function createAccount(email, password) {
  return new Promise((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => resolve("Success signing in user"))
    .catch(err => {
      console.log("Error creating account: ", err.message)
      reject(err.message)
    })
  })
}

export function addName(firstName, lastName) {
  return new Promise((resolve, reject) => {
    const user = firebase.auth().currentUser

    user.updateProfile({
      displayName: `${firstName} ${lastName}`
    })
    .then(() => resolve("Name update successful"))
    .catch(() => reject("Error adding name to profile."))
  })
}

export function validateEmail(email) {
  return new Promise((resolve, reject) => {
    // check for @ sign
    const eVal = email.slice()
    const breakIndex = eVal.indexOf("@")
    if (breakIndex === -1) { reject("No @ sign in email") }

    // check for valid recipient name
    const name = eVal.slice(0, breakIndex)
    if (name.length < 1) { reject("Invalid email") }
    if (!checkCharacters(expandedChars, name)) { reject("Invalid email") }

    // check for . in suffix
    const suffix = eVal.slice(breakIndex + 1)
    const dotIndex = suffix.indexOf(".")
    if (suffix.length < 1) { reject("Invalid email") }
    if (dotIndex === -1) { reject("Invalid email") }

    // check for valid domain (pre extension)
    const domain = suffix.slice(0, dotIndex)
    if (domain.length < 1) { reject("Invalid email") }
    if (!checkCharacters(narrowChars, domain)) { reject("Invalid email") }

    // check for valid extension
    const validExtensions = ["com", "net", "org", "co", "uk"]
    const ext = suffix.slice(dotIndex + 1)
    const match = validExtensions.find(element => element === ext)
    if (match === undefined) { reject("Invalid email") }

    resolve("Valid Email")
  })
}

export function validatePassword(password) {
  return new Promise((resolve, reject) => {
    const length = password.length

    // check for invalid characters
    if (!checkCharacters(expandedChars, password)) { reject("Invalid characters in password") }

    // check for proper length
    if (length < 8 || length > 20) { reject("Password must be between 8 and 20 characters in length") }

    resolve("Valid Password")
  })
}

export function confirmNotEmpty(array) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].length < 1 || array[i] === null || array[i] === undefined) { reject("All fields are required.") }
    }
    resolve("All fields are filled")
  })
}

export function confirmMatch(field1, field2, type) {
  return new Promise((resolve, reject) => {
    if (field1 === field2) { resolve("match confirmed") }
    else { reject(`${type} fields did not match`)}
  })
}
