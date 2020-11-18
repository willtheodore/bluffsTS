import * as firebase from "firebase";
import { firestore } from "../firebase";
import { DocumentSnapshot, ReturnObject } from "./users";

type APIReturn<DataType> = Promise<ReturnObject<DataType>>;
const APIReturn = Promise;
const FieldValue = firebase.firestore.FieldValue;

export interface FSParagraph {
	paragraphNumber: number;
	content: string;
}

export const getCloudContent = async (
	requestId: string
): APIReturn<FSParagraph[]> => {
	try {
		const pageDoc = await firestore.collection("pages").doc(requestId).get();
		let result: FSParagraph[] = [];
		const pageData = pageDoc.data();
		for (const paragraph in pageData) {
			result.push({
				paragraphNumber: Number(paragraph),
				content: pageData[paragraph],
			});
		}
		return {
			message: "Success! Data has been retrieved from the cloud.",
			data: result,
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const setCloudContentListener = async (
	requestId: string,
	onChange: (input: FSParagraph[]) => void
): APIReturn<VoidFunction> => {
	try {
		const unsub = firestore
			.collection("pages")
			.doc(requestId)
			.onSnapshot((pageSnapshot: DocumentSnapshot) => {
				let result: FSParagraph[] = [];
				let pageData = pageSnapshot.data();
				for (const paragraph in pageData) {
					result.push({
						paragraphNumber: Number(paragraph),
						content: pageData[paragraph],
					});
				}
				onChange(result);
			});
		return {
			message: "Success. Set listener and returning unsubscriber",
			data: unsub,
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const changeParagraphByNumber = async (
	text: string,
	num: number,
	page: string
): APIReturn<null> => {
	try {
		await firestore
			.collection("pages")
			.doc(page)
			.update({
				[num]: text,
			});
		return {
			data: null,
			message: "Success. Paragraph has been updated.",
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const deleteParagraph = async (
	paragraph: FSParagraph,
	page: string
): APIReturn<null> => {
	try {
		await firestore
			.collection("pages")
			.doc(page)
			.update({
				[paragraph.paragraphNumber]: FieldValue.delete(),
			});
		return {
			message: "Success. Paragraph has been deleted.",
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const addParagraphBelowNumber = async (
	numberAboveNew: number,
	page: string,
	pageData: FSParagraph[]
): APIReturn<null> => {
	try {
		const pageObject = getNewPageObject(pageData, numberAboveNew);
		await firestore.collection("pages").doc(page).set(pageObject);
		return {
			message: "Success. Empty paragraph added below number.",
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};
type StringObject = { [key: string]: string };
const getNewPageObject = (
	pageData: FSParagraph[],
	numberAboveNew: number
): StringObject => {
	let result: StringObject = {};
	for (const paragraph of pageData) {
		const num = paragraph.paragraphNumber;
		if (num <= numberAboveNew) {
			result[num] = paragraph.content;
		} else {
			result[num + 1] = paragraph.content;
		}
	}
	result[numberAboveNew + 1] = "";
	return result;
};
