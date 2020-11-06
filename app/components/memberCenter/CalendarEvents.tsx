import * as React from "react";
import { createRef, RefObject } from "react";

import DatePicker from "../DatePicker";
import TimeSelector from "../TimeSelector";

export default function CalendarEvents() {
	const title = createRef<HTMLInputElement>();
	const description = createRef<HTMLTextAreaElement>();

	const onDateChange = (day: number, month: number, year: number) => {
		console.log(day, month, year);
	};

	const onTimeChange = (type: string, hours: number, minutes: number) => {
		console.log("type: ", type);
		console.log(hours, minutes);
	};

	return (
		<div id="calendar-events">
			<h1>Create an event</h1>
			<div className="content-wrapper">
				<div className="inputs">
					<DatePicker label="date" onChange={onDateChange} />
					<TimeSelector
						label="startTime"
						onChange={(hours, minutes) => onTimeChange("start", hours, minutes)}
					/>
					<TimeSelector
						label="endTime"
						onChange={(hours, minutes) => onTimeChange("end", hours, minutes)}
					/>
					<EventInput label="title" reference={title} type="input" />
					<EventInput
						label="description"
						reference={description}
						type="textarea"
					/>
				</div>
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
