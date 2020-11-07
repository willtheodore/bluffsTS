import * as React from "react";
import {
	createRef,
	Fragment,
	RefObject,
	useContext,
	useEffect,
	useState,
} from "react";
import AuthContext from "../../contexts/auth";
import { createCalendarEvent } from "../../utils/calendar";
import { BluffsUser } from "../../utils/users";

import DatePicker from "../DatePicker";
import TimeSelector from "../TimeSelector";

export default function CalendarEvents() {
	const [dateString, setDateString] = useState<string>("d=1&m=0&y=2000");
	const [startTime, setStartTime] = useState<string>("00:00");
	const [endTime, setEndTime] = useState<string>("00:00");
	const [message, setMessage] = useState<string | null>(null);
	const title = createRef<HTMLInputElement>();
	const description = createRef<HTMLTextAreaElement>();
	const user: BluffsUser = useContext(AuthContext);

	useEffect(() => {
		console.log("date string", dateString);
		console.log("start time", startTime);
		console.log("end time", endTime);
	}, [dateString, startTime, endTime]);

	const onDateChange = (day: number, month: number, year: number) => {
		if (day <= 31 && month <= 11) {
			setDateString(`d=${day}&m=${month}&y=${year}`);
		}
	};

	const handleSubmit = async () => {
		if (!title.current || !description.current || !dateString) {
			setMessage("Make sure to fill in all fields.");
			return;
		}
		const dVal = description.current.value;
		const tVal = title.current.value;
		const dateMatches = dateString.match(/d=(\d+)/);
		const monthMatches = dateString.match(/m=(\d+)/);
		const yearMatches = dateString.match(/y=(\d+)/);

		if (!dateMatches || !monthMatches || !yearMatches) {
			setMessage("We were unable to get a proper date.");
			return;
		}

		const response = await createCalendarEvent(
			tVal,
			dVal,
			Number(dateMatches[1]),
			Number(monthMatches[1]),
			Number(yearMatches[1]),
			startTime,
			endTime,
			user.uid
		);
		setMessage(response.message);
	};

	const onTimeChange = (type: string, hours: number, minutes: number) => {
		const validate = (hour: number, minute: number): boolean =>
			hour > 0 && hour < 25 && minute < 60 && minute >= 0;
		const format = (value: number): string => {
			return value < 10 ? `0${value}` : `${value}`;
		};
		if (type === "start" && validate(hours, minutes)) {
			setStartTime(`${format(hours)}:${format(minutes)}`);
		}
		if (type === "end") {
			setEndTime(`${format(hours)}:${format(minutes)}`);
		}
	};

	return (
		<div id="calendar-events">
			<h1>Create an event</h1>
			<div className="content-wrapper">
				{message ? (
					<p className="message">{message}</p>
				) : (
					<Fragment>
						<div className="inputs">
							<DatePicker label="date" onChange={onDateChange} />
							<TimeSelector
								label="start time"
								onChange={(hours, minutes) =>
									onTimeChange("start", hours, minutes)
								}
							/>
							<TimeSelector
								label="end time"
								onChange={(hours, minutes) =>
									onTimeChange("end", hours, minutes)
								}
							/>
							<p className="headline">Please use 24 hour time.</p>
							<EventInput label="title" reference={title} type="input" />
							<EventInput
								label="description"
								reference={description}
								type="textarea"
							/>
						</div>
						<button onClick={handleSubmit} className="btn btn-bold-red">
							SUBMIT
						</button>
					</Fragment>
				)}
			</div>
		</div>
	);
}

interface EventInputProps {
	label: string;
	reference: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>;
	type: string;
}

function EventInput({ label, reference, type }: EventInputProps) {
	if (type === "input") {
		return (
			<div className="event-input">
				<label htmlFor={label} style={{ alignSelf: "center" }}>
					{label}
				</label>
				<input type="text" ref={reference as RefObject<HTMLInputElement>} />
			</div>
		);
	}
	return (
		<div className="event-input">
			<label htmlFor={label}>{label}</label>
			<textarea ref={reference as RefObject<HTMLTextAreaElement>} />
		</div>
	);
}
