import * as React from "react";
import { useState } from "react";
import { FSEvent, getEventById } from "../../utils/calendar";
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
		if ((path[2] = "eventDetail")) {
			if (search.eventId) {
				const apiResponse = await getEventById(search.eventId);
				console.log(apiResponse.message);
				//TODO: remove console log above
				const eventData = apiResponse.data;
				if (eventData) {
					setEvent(eventData);
				} else {
					setError(apiResponse.message);
				}
			}
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
