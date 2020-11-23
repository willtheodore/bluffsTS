import firebase, { firestore } from "../firebase";
import { DocumentSnapshot, ReturnObject } from "./users";

type APIReturn<DataType> = Promise<ReturnObject<DataType>>;
const APIReturn = Promise;

export interface JobPosting {
	title: string;
	category: string;
	fileName: string;
	season: string;
}

export const getPostings = async (): APIReturn<JobPosting[]> => {
	try {
		const querySnapshot = await firestore.collection("jobs").get();
		let result: JobPosting[] = [];
		querySnapshot.forEach((docSnapshot: DocumentSnapshot) => {
			const jobInfo = docSnapshot.data() as JobPosting;
			result.push(jobInfo);
		});

		return {
			message: "Success. Returning all job postings.",
			data: result,
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const getPostingUrlByFilename = async (
	fileName: string
): APIReturn<string> => {
	try {
		const jobsRef = firebase.storage().ref().child("jobs");
		const postingRef = jobsRef.child(fileName);
		const postingUrl = await postingRef.getDownloadURL();
		console.log("url:", postingUrl);

		return {
			message: "Success. Returning posting file download URL",
			data: postingUrl,
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};
