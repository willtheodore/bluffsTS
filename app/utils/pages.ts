import { firestore } from "../firebase";
import { ReturnObject } from "./users";

type APIReturn<DataType> = Promise<ReturnObject<DataType>>;
const APIReturn = Promise;

export const getCloudContent = async (
	requestId: string
): APIReturn<string[]> => {
	try {
		const pageDoc = await firestore.collection("pages").doc(requestId).get();
		let result: string[] = [];
		const pageData = pageDoc.data();
		for (const paragraph in pageData) {
			result.push(pageData[paragraph]);
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
