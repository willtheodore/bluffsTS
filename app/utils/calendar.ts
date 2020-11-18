import firebase, { firestore } from "../firebase";
import {
	CollectionReference,
	DocumentReference,
	DocumentSnapshot,
	QuerySnapshot,
	ReturnObject,
} from "./users";

export interface FSEvent {
	categories?: FSEventCategory;
	title: string;
	eventId?: string;
	startTime: string;
	endTime: string;
	description: string;
	day: number;
	month: number;
	year: number;
	author: string;
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
			.where("date", "==", day)
			.where("month", "==", month)
			.where("year", "==", year)
			.get();

		let events: FSEvent[] = [];
		dayQuery.forEach((event: DocumentSnapshot) => {
			const eventData = event.data() as FSEvent;
			events.push({
				eventId: event.id,
				...eventData,
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
			const eventData = event.data() as FSEvent;
			events.push({
				eventId: event.id,
				...eventData,
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

export const deleteEventById = async (id: string): APIReturn<null> => {
	try {
		await firestore.collection("events").doc(id).delete();
		return {
			message: "Success. Event has been deleted.",
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const getEventById = async (id: string): APIReturn<FSEvent> => {
	try {
		const eventSnapshot = await firestore.collection("events").doc(id).get();
		const event = eventSnapshot.data() as FSEvent;
		return {
			message: "Success. Returning the event",
			data: {
				eventId: eventSnapshot.id,
				...event,
			},
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

type UpdateEvent = (event: FSEvent) => void;
export const setEventListenerById = async (
	id: string,
	onChange: UpdateEvent
): APIReturn<null> => {
	try {
		firestore
			.collection("events")
			.doc(id)
			.onSnapshot((eventSnapshot: DocumentSnapshot) => {
				const event = eventSnapshot.data() as FSEvent;
				if (event) {
					onChange({
						eventId: eventSnapshot.id,
						...event,
					});
				}
			});
		return {
			message: "Success! Listener set.",
			data: null,
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

type UpdateEvents = (events: FSEvent[]) => void;
export const setEventListenersByDate = async (
	day: number,
	month: number,
	year: number,
	onChange: UpdateEvents
): APIReturn<CollectionReference> => {
	try {
		firestore
			.collection("events")
			.where("day", "==", day)
			.where("month", "==", month)
			.where("year", "==", year)
			.onSnapshot((eventsSnapshot: QuerySnapshot) => {
				let result: FSEvent[] = [];
				eventsSnapshot.forEach((event: DocumentSnapshot) => {
					const eventData = event.data() as FSEvent;
					result.push({
						eventId: event.id,
						...eventData,
					});
				});
				onChange(result);
			});
		return {
			message: "Success. Listener set for all events on this date.",
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};

export const createCalendarEvent = async (
	title: string,
	description: string,
	day: number,
	month: number,
	year: number,
	startTime: string,
	endTime: string,
	author: string
): APIReturn<DocumentReference> => {
	try {
		const docRef = await firestore.collection("events").add({
			title,
			description,
			day,
			month,
			year,
			startTime,
			endTime,
			author,
		});
		return {
			message: "Success. Event has been added to the calendar",
			data: docRef,
		};
	} catch (e) {
		return {
			message: `Encountered error: ${e.message}`,
		};
	}
};
