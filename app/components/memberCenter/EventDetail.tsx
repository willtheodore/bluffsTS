import * as React from "react";
import { useState } from "react";
import { FSEvent, getEventsByDate } from "../../utils/calendar";
import { formatTime, parsePath, parseSearch } from "../../utils/formatters";

export default function EventDetail() {
	const [event, setEvent] = useState<FSEvent | null>(null);
	const [error, setError] = useState<string | null>(null);
	const path = parsePath(document.location);
	const search = parseSearch(document.location);

	React.useEffect(() => {
		updateEvent();
	}, [path, search]);

	const updateEvent = async () => {
		try {
			if ((path[2] = "eventDetail")) {
				if (search.eventId) {
					const jsDate = new Date(Number(search.eventId));
					const day = jsDate.getDate();
					const month = jsDate.getMonth();
					const year = jsDate.getFullYear();

					const events = await getEventsByDate(day, month, year);
					if (!events.data) {
						throw Error("There are no events we could find.");
					}
					for (const item of events.data) {
						if (item.eventId === search.eventId) {
							setEvent(item);
						} else {
							console.log("Unable to find an event matching that id.");
						}
					}
				}
			}
		} catch (e) {
			setError(e.message);
		}
	};

	if (error) {
		return <div className="event-detail content-wrapper error">{error}</div>;
	}

	if (event) {
		return (
			<div className="event-detail">
				<h1>{event.title}</h1>
				<div className="content-wrapper">
					<p className="time">{`Time: ${formatTime(
						event.startTime,
						event.endTime
					)}`}</p>
					<p>{event.description}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="event-detail">
			<div className="content-wrapper">Please wait a moment.</div>
		</div>
	);
}
