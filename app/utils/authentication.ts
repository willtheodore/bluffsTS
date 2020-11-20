import firebase, { firestore } from "../firebase";
import { ReturnObject } from "./users";

type APIReturn<T> = Promise<ReturnObject<T>>;

const APIReturn = Promise;

const expandedChars = [
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"0",
	"?",
	"!",
	"'",
	"+",
	"@",
	"#",
	"$",
	"%",
	"^",
	"&",
	"*",
	"_",
	"-",
	"=",
	"/",
	"|",
];

const narrowChars = [
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"0",
	"-",
];

/**
 * Checks the characters of an input string against an array of allowed characters
 *
 * @param validChars {string[]} an array of characters to check against.
 * @param inputString {string} the string to check
 * @returns {boolean} true if all characters in inputString are in validChars array
 */
function checkCharacters(validChars: string[], inputString: string): boolean {
	const token = inputString.toLowerCase();
	for (let i = 0; i < token.length; i++) {
		const char = validChars.find((element) => element === token[i]);
		if (char === undefined) {
			return false;
		}
	}
	return true;
}

/**
 * Signs out the currently logged in user.
 *
 * @returns {APIReturn<null>} a Promise containing a success message
 */
export const signOut = async (): APIReturn<null> => {
	try {
		await firebase.auth().signOut();
		return { message: "success", data: null };
	} catch (e) {
		console.log("Error from 'signOut' in 'authentication.ts'", e);
		throw e;
	}
};

/**
 * Signs in the user using email and password
 *
 * @param email {string} the email of the user to sign in
 * @param password {string} the password of the user to sign in
 * @returns {APIReturn<null>} a Promise containing a success message
 */
export const signInUser = async (
	email: string,
	password: string
): APIReturn<null> => {
	try {
		await firebase.auth().signInWithEmailAndPassword(email, password);
		return { message: "success", data: null };
	} catch (e) {
		console.log("Error from 'signInUser' in 'authentication.ts'", e);
		throw e;
	}
};

/**
 * Creates a user account using email and password
 *
 * @param email {string} the email of the new user. Must be validated elsewhere
 * @param password {string} the password of the new user. Must be validated elsewhere
 * @returns {APIReturn<null>} a Promise containing a success message.
 */
export const createAccount = async (
	email: string,
	password: string
): APIReturn<null> => {
	try {
		await firebase.auth().createUserWithEmailAndPassword(email, password);
		return { message: "success", data: null };
	} catch (e) {
		console.log("Error from 'createAccount' in 'authentication.ts'", e);
		throw e;
	}
};

/**
 * Adds a display name to the user object in the firebase authentication database
 *
 * @param firstName {string} the first name of the user
 * @param lastName {string} the last name of the user
 * @returns {APIReturn<null>} a Promise containing a success message
 */
export const addName = async (
	firstName: string,
	lastName: string
): APIReturn<null> => {
	try {
		const currentUser = firebase.auth().currentUser;
		if (!currentUser) {
			throw Error("Please sign in.");
		}

		await currentUser.updateProfile({
			displayName: `${firstName} ${lastName}`,
		});
		return { message: "success", data: null };
	} catch (e) {
		console.log("Error from 'addName' in 'authentication.ts'", e);
		throw e;
	}
};

/**
 * Checks to see if an email is valid
 *
 * @param email {string} an email to validate
 * @returns {boolean} true if the email is valid, throws an error otherwise
 */
export function validateEmail(email: string): boolean {
	// check for @ sign
	const eVal = email.slice();
	const breakIndex = eVal.indexOf("@");
	if (breakIndex === -1) {
		throw Error("Invalid email");
	}

	// check for valid recipient name
	const name = eVal.slice(0, breakIndex);
	if (name.length < 1) {
		throw Error("Invalid email");
	}
	if (!checkCharacters(expandedChars, name)) {
		throw Error("Invalid email");
	}

	// check for . in suffix
	const suffix = eVal.slice(breakIndex + 1);
	const dotIndex = suffix.indexOf(".");
	if (suffix.length < 1) {
		throw Error("Invalid email");
	}
	if (dotIndex === -1) {
		throw Error("Invalid email");
	}

	// check for valid domain (pre extension)
	const domain = suffix.slice(0, dotIndex);
	if (domain.length < 1) {
		throw Error("Invalid email");
	}
	if (!checkCharacters(narrowChars, domain)) {
		throw Error("Invalid email");
	}

	// check for valid extension
	const validExtensions = ["com", "net", "org", "co", "uk"];
	const ext = suffix.slice(dotIndex + 1);
	const match = validExtensions.find((element) => element === ext);
	if (match === undefined) {
		throw Error("Invalid email");
	}
	return true;
}

/**
 * Checks to see if a password is valid
 *
 * @param password {string} a password to check
 * @returns {boolean} true if the password is valid, throws an error otherwise
 */
export function validatePassword(password: string) {
	const length = password.length;

	// check for invalid characters
	if (!checkCharacters(expandedChars, password)) {
		throw Error("Invalid password");
	}

	// check for proper length
	if (length < 8 || length > 20) {
		throw Error("Invalid password");
	}

	return true;
}

/**
 * Validates that each string in an array is not empty
 *
 * @param array {string[]} an array to check
 * @returns {boolean} true if the strings of the array are not empty, false otherwise
 */
export function confirmNotEmpty(array: string[]) {
	for (let i = 0; i < array.length; i++) {
		if (array[i].length < 1 || array[i] === null || array[i] === undefined) {
			return false;
		}
	}
	return true;
}

export const validateMemberCode = async (code: string): Promise<boolean> => {
	try {
		const memberCodeSnapshot = await firestore
			.collection("users")
			.doc("memberCode")
			.get();
		const memberCodeData = memberCodeSnapshot.data();
		if (!memberCodeData) {
			return false;
		}

		const memberCode = memberCodeData.value;
		return memberCode === code;
	} catch (e) {
		return false;
	}
};
