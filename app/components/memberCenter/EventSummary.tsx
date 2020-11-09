import * as React from "react";
import { useEffect, useState } from "react";
import { FSEvent, setEventListenersByDate } from "../../utils/calendar";
import { parseSearch } from "../../utils/formatters";
import EventDetail from "./EventDetail";

export default function EventSummary() {
	const [events, setEvents] = useState<FSEvent[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const search = parseSearch(document.location);

	useEffect(() => {
		updateEvents();
	}, []);

	const updateEvents = async () => {
		if (search.d && search.m && search.y) {
			const day = Number(search.d);
			const month = Number(search.m);
			const year = Number(search.y);
			const apiResponse = await setEventListenersByDate(
				day,
				month,
				year,
				(eventsAfterUpdate: FSEvent[]) => {
					setEvents(eventsAfterUpdate);
				}
			);
			if (apiResponse.message[0] != "S") {
				setError(apiResponse.message);
			}
		} else {
			setEvents(null);
		}
	};

	if (error) {
		return (
			<div className="content-wrapper">
				<p className="error">{error}</p>
			</div>
		);
	}

	return (
		<div className="event-summary">
			{events &&
				events.map((event) => (
					<div key={event.eventId}>
						<EventDetail passedEvent={event} />
					</div>
				))}
		</div>
	);
}
