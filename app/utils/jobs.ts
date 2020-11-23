import firebase, { firestore } from "../firebase";
import { DocumentSnapshot, QuerySnapshot, ReturnObject } from "./users";

type APIReturn<DataType> = Promise<ReturnObject<DataType>>;
const APIReturn = Promise;

export interface JobPosting {
	title: string;
	category: string;
	fileName: string;
	season: string;
	postingId?: string;
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

export const setPostingListener = (
	onChange: (postings: JobPosting[]) => void
): ReturnObject<VoidFunction> => {
	try {
		const unsub = firestore
			.collection("jobs")
			.onSnapshot((postingsSnapshot: QuerySnapshot) => {
				let postings: JobPosting[] = [];
				postingsSnapshot.forEach((posting: DocumentSnapshot) => {
					const postingData = posting.data() as JobPosting;
					postings.push({
						postingId: posting.id,
						...postingData,
					});
				});
				onChange(postings);
			});

		return {
			message: "Success. Listener has been set. Returning unsubscriber.",
			data: unsub,
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const deleteJobPosting = async (
	posting: JobPosting
): APIReturn<null> => {
	try {
		const postingRef = firebase
			.storage()
			.ref()
			.child(`jobs/${posting.fileName}`);
		await firestore.collection("jobs").doc(posting.postingId).delete();
		await postingRef.delete();

		return {
			message: "Success. Posting has been deleted in all locations.",
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const postJob = async (
	title: string,
	season: string,
	category: string,
	file: File
): APIReturn<null> => {
	try {
		const fileName = file.name;
		const newRef = firebase.storage().ref().child(`jobs/${fileName}`);
		await newRef.put(file);
		await firestore.collection("jobs").add({
			title,
			season,
			category,
			fileName,
		});

		return {
			message:
				"Success. Post has been added to storage as well as the database.",
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};
