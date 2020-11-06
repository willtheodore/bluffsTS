import firebase, { firestore } from "../firebase";
import { DocumentSnapshot, ReturnObject } from "./users";

export interface FSEvent {
	categories?: FSEventCategory;
	title: string;
	eventId: string;
	startTime: string;
	endTime: string;
	description: string;
	day: number;
	month: number;
	year: number;
}
export enum FSEventCategory {
	tennis,
	swim,
	announcements,
}
// TODO: ask M. Beaton for updates on categories

type APIReturn<DataType> = Promise<ReturnObject<DataType>>;
const APIReturn = Promise;
const FieldPath = firebase.firestore.FieldPath;
const FieldValue = firebase.firestore.FieldValue;

export const getEventsByDate = async (
	day: number,
	month: number,
	year: number
): APIReturn<FSEvent[]> => {
	try {
		if (isNaN(day) || isNaN(month) || isNaN(year)) {
			throw Error(
				"The values passed for day, month, or year are not a number."
			);
		}

		const dayQuery = await firestore
			.collection("events")
			.where("day", "==", day)
			.where("month", "==", month)
			.where("year", "==", year)
			.get();

		let events: FSEvent[] = [];
		dayQuery.forEach((event: DocumentSnapshot) => {
			events.push({
				eventId: event.id,
				...event.data(),
			});
		});

		if (events.length > 0) {
			return {
				message: "Success. Returning the array of events.",
				data: events,
			};
		} else {
			return {
				message: "No events were found at this date.",
			};
		}
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const getEventsByMonth = async (
	month: number,
	year: number
): APIReturn<FSEvent[]> => {
	try {
		if (isNaN(month) || isNaN(year)) {
			throw Error("Month or year is not a number.");
		}

		const eventsQuery = await firestore
			.collection("events")
			.where("month", "==", month)
			.where("year", "==", year)
			.get();

		let events: FSEvent[] = [];
		eventsQuery.forEach((event: DocumentSnapshot) => {
			events.push({
				eventId: event.id,
				...event.data(),
			});
		});

		return {
			message: "Success. Returning an array of events",
			data: events,
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};
