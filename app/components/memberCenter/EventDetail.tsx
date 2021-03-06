import * as React from "react";
import { Fragment, useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AuthContext from "../../contexts/auth";
import {
	deleteEventById,
	FSEvent,
	setEventListenerById,
} from "../../utils/calendar";
import {
	formatLinks,
	formatTime,
	parsePath,
	parseSearch,
} from "../../utils/formatters";
import { BluffsUser } from "../../utils/users";

interface EventDetailProps {
	passedEvent?: FSEvent | null;
}

export default function EventDetail({ passedEvent = null }: EventDetailProps) {
	const [event, setEvent] = useState<FSEvent | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
	const path = parsePath(document.location);
	const search = parseSearch(document.location);
	const user: BluffsUser = useContext(AuthContext);

	useEffect(() => {
		if (!passedEvent) {
			updateEvent();
		} else {
			setEvent(passedEvent);
		}
	}, []);

	const updateEvent = async () => {
		if ((path[2] = "eventDetail")) {
			if (search.eventId) {
				const apiResponse = await setEventListenerById(
					search.eventId,
					(changedEvent) => {
						setEvent(changedEvent);
					}
				);

				if (apiResponse.message[0] !== "S") {
					setError(apiResponse.message);
				}
			}
		}
	};

	const handleDelete = async (id?: string) => {
		if (confirmDelete) {
			const apiResult = await deleteEventById(confirmDelete);
			setError(apiResult.message);
		} else if (id) {
			setConfirmDelete(id);
		}
	};

	if (error) {
		return <div className="event-detail content-wrapper error">{error}</div>;
	}

	if (event) {
		return (
			<div className="event-detail">
				<div className="header">
					<h1>{event.title}</h1>
					{event.author === user.uid &&
						(!confirmDelete ? (
							<FaTrash
								size={36}
								onClick={() => handleDelete(event.eventId)}
								color="#EF233C"
							/>
						) : (
							<Fragment>
								<button
									className="btn btn-bold-muted"
									onClick={() => setConfirmDelete(null)}
								>
									CANCEL
								</button>
								<button
									className="btn btn-bold-red"
									onClick={() => handleDelete()}
								>
									CONFIRM
								</button>
							</Fragment>
						))}
				</div>
				<div className="content-wrapper">
					<p className="time">{`Time: ${formatTime(
						event.startTime,
						event.endTime
					)}`}</p>
					<p
						className="format-links event-content"
						dangerouslySetInnerHTML={{ __html: formatLinks(event.description) }}
					></p>
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
