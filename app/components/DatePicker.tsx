import * as React from "react";
import { CSSProperties, useEffect, useState } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { SetState } from "./Selector";

interface DatePickerProps {
	label: string;
	onChange: (day: number, month: number, year: number) => void;
}

export default function DatePicker({ label, onChange }: DatePickerProps) {
	const today = new Date(Date.now());
	const [day, setDay] = useState<number>(today.getDate());
	const [month, setMonth] = useState<number>(today.getMonth());
	const [year, setYear] = useState<number>(today.getFullYear());
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	useEffect(() => {
		onChange(day, month, year);
	}, [day, month, year]);

	return (
		<div className="date-picker">
			<h6 className="date-picker-label">{label}</h6>
			<div className="date-picker-wrapper">
				<DatePickerSelector state={[year, setYear]} />
				<DatePickerSelector
					state={[month, setMonth]}
					valueLabels={monthNames}
				/>
				<hr />
				<DatePickerCalendar
					state={[day, setDay]}
					yearNum={year}
					monthNum={month}
				/>
			</div>
		</div>
	);
}

interface DatePickerCalendarProps {
	state: [number, SetState<number>];
	yearNum: number;
	monthNum: number;
}

function DatePickerCalendar({
	state,
	yearNum,
	monthNum,
}: DatePickerCalendarProps) {
	const [value, setValue] = state;
	const daysInMonth = [
		31,
		yearNum % 4 === 0 ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31,
	];

	const getInitialDay = (): Date => {
		let jsDate = new Date(Date.now());
		jsDate.setDate(1);
		jsDate.setMonth(monthNum);
		jsDate.setFullYear(yearNum);
		return jsDate;
	};
	const initialDay = getInitialDay();

	const getSquares = () => {
		let result = [];
		for (let i = 1; i <= daysInMonth[monthNum]; i++) {
			result.push(i);
		}
		return result;
	};

	const formatDay = (day: number) => {
		if (day === 0) {
			return 6;
		} else {
			return day - 1;
		}
	};

	const getWeekdayAndRowInfo = (date: number) => {
		let row = 1;
		let weekday = formatDay(initialDay.getDay()) - 1;
		for (let i = 1; i <= date; i++) {
			if (weekday === 6) {
				weekday = 0;
				row = row + 1;
			} else {
				weekday = weekday + 1;
			}
		}
		return [weekday, row];
	};

	const totalNumRows = getWeekdayAndRowInfo(daysInMonth[monthNum])[1];
	return (
		<div
			className="date-picker-calendar"
			style={{ gridTemplateRows: `repeat(${totalNumRows}, 1fr)` }}
		>
			{getSquares().map((squareNum) => {
				const activeStyle = {
					backgroundColor: "#3892CC",
					color: "white",
				};
				const [weekday, row] = getWeekdayAndRowInfo(squareNum);
				let style: CSSProperties = {
					gridRow: `${row}/${row + 1}`,
					gridColumn: `${weekday + 1}/${weekday + 2}`,
				};
				if (value === squareNum) {
					style = {
						...activeStyle,
						...style,
					};
				}

				return (
					<div
						key={squareNum}
						className="date-picker-square pointer"
						style={style}
						onClick={() => setValue(squareNum)}
					>
						<p>{squareNum}</p>
					</div>
				);
			})}
		</div>
	);
}

interface DatePickerSelectorProps {
	state: [number, SetState<number>];
	valueLabels?: string[] | null;
}

function DatePickerSelector({ state, valueLabels }: DatePickerSelectorProps) {
	const [value, setValue] = state;

	const handleClick = (type: string) => {
		if (valueLabels && value === 0 && type === "decrease") {
			setValue(valueLabels.length - 1);
		} else if (
			valueLabels &&
			value === valueLabels.length - 1 &&
			type === "increase"
		) {
			setValue(0);
		} else {
			type === "increase" ? setValue(value + 1) : setValue(value - 1);
		}
	};

	return (
		<div className="date-picker-selector">
			<FaAngleLeft onClick={() => handleClick("decrease")} />
			<h6 className="noselect">{valueLabels ? valueLabels[value] : value}</h6>
			<FaAngleRight onClick={() => handleClick("increase")} />
		</div>
	);
}
