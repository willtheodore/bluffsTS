import * as React from "react";
import { CSSProperties, useEffect, useState } from "react";

interface TimeSelectorProps {
	label: string;
	onChange: (hours: number, minutes: number) => void;
}

export default function TimeSelector({ label, onChange }: TimeSelectorProps) {
	const [hour, setHour] = useState<number>(12);
	const [minute, setMinute] = useState<number>(0);
	const [hourInput, setHourInput] = useState<string>("");
	const [minuteInput, setMinuteInput] = useState<string>("");
	const [zeroHidden, setZeroHidden] = useState<CSSProperties>({});

	useEffect(() => {
		if (minute >= 10) {
			setZeroHidden({
				opacity: "0%",
			});
		} else if (minuteInput == "") {
			setZeroHidden({
				opacity: "30%",
			});
		} else {
			setZeroHidden({
				opacity: "100%",
			});
		}
	}, [minute, minuteInput]);

	useEffect(() => {
		onChange(hour, minute);
	}, [hour, minute]);

	const formatHour = (value: string): string => {
		if (value === "" || value.search(/\D/) !== -1) {
			return ``;
		}
		const number = Number(value);
		if (isNaN(number) || !number || number > 12 || number < 1) {
			return `error`;
		}
		setHour(number);
		return `${number}`;
	};

	const formatMinute = (value: string): string => {
		if (value === "" || value.search(/\D/) !== -1) {
			return ``;
		}
		const number = Number(value);
		if (isNaN(number) || number >= 60 || number < 0) {
			return `error`;
		}
		setMinute(number);
		return `${number}`;
	};

	const updateValue = (type: string, value: string) => {
		if (type === "hour") {
			const formatted = formatHour(value);
			if (formatted === "error") {
				return;
			} else {
				setHourInput(formatted);
			}
		} else {
			const formatted = formatMinute(value);
			if (formatted === "error") {
				return;
			} else {
				setMinuteInput(formatted);
			}
		}
	};

	return (
		<div className="time-selector-wrapper">
			<h6 className="time-selector-label">{label}</h6>
			<div className="time-selector">
				<input
					placeholder={`${hour}`}
					type="text"
					value={hourInput}
					onChange={(e) => updateValue("hour", e.target.value)}
				/>
				<p className="divider">:</p>
				<p style={zeroHidden} className="extra-zero">
					0
				</p>
				<input
					className="minute"
					placeholder={`${minute}`}
					value={minuteInput}
					type="text"
					onChange={(e) => updateValue("minute", e.target.value)}
				/>
			</div>
		</div>
	);
}
