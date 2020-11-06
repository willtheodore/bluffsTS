import * as React from "react";
import { CSSProperties, Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
	FSEvent,
	getEventsByDate,
	getEventsByMonth,
} from "../../utils/calendar";

import Selector from "../Selector";
import { getMonth, getYears } from "./Archive";

export default function CalendarMain() {
	const [month, setMonth] = useState<string | null>(null);
	const [year, setYear] = useState<number | null>(null);

	const months = [
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
	const fullMonths = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const getCurrentHeader = (monthIn: string, yearIn: number): string => {
		const index = months.indexOf(monthIn);
		const fullMonth = fullMonths[index];
		return `${fullMonth}, ${yearIn}`;
	};

	return (
		<div id="calendar-main">
			<div className="selectors">
				<Selector title="Year" items={getYears()} setState={setYear} />
				<Selector
					title="Month"
					items={months}
					setState={setMonth}
					preSelected={getMonth()}
				/>
			</div>

			{month && year && (
				<Fragment>
					<h2 className="header">{getCurrentHeader(month, year)}</h2>
					<CalendarView
						monthNum={months.indexOf(month ? month : "MONTH")}
						yearNum={year ? year : -1}
					/>
				</Fragment>
			)}
		</div>
	);
}

interface CalendarViewProps {
	monthNum: number;
	yearNum: number;
}
interface GridItem {
	day: number;
	events?: FSEvent[];
}
interface EventStore {
	[key: number]: FSEvent[];
}

function CalendarView({ monthNum, yearNum }: CalendarViewProps) {
	const [monthlyEvents, setMonthlyEvents] = useState<EventStore>({});
	const [loading, setLoading] = useState<boolean>(true);
	const day1 = useRef<Date>(new Date("January 1, 2000, 00:00:00"));
	day1.current.setFullYear(yearNum);
	day1.current.setMonth(monthNum);
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

	useEffect(() => {
		day1.current.setFullYear(yearNum);
		day1.current.setMonth(monthNum);
		updateEvents();
	}, [monthNum, yearNum]);

	const updateEvents = async () => {
		setLoading(true);
		let result: EventStore = {};

		const apiResponse = await getEventsByMonth(monthNum, yearNum);
		console.log(apiResponse.message);
		// TODO: remove above console log
		const eventsInMonth = apiResponse.data;
		if (!eventsInMonth) {
			setLoading(false);
			return;
		}
		for (const event of eventsInMonth) {
			const eventDay = event.day;
			if (result[eventDay]) {
				result[eventDay].push(event);
			} else {
				result[eventDay] = [event];
			}
		}

		setMonthlyEvents(result);
		setLoading(false);
	};

	const formatDay = (day: number): number => {
		if (day === 0) {
			return 6;
		} else return day - 1;
	};

	const calculateRow = (initialWeekday: number, day: number): number => {
		let currentWeekday = initialWeekday;
		let count = 1;
		for (let i = 1; i < day; i++) {
			if (currentWeekday === 6) {
				currentWeekday = 0;
				count = count + 1;
			} else {
				currentWeekday++;
			}
		}
		return count;
	};

	const generateCalendarGrid = (): GridItem[] => {
		// set up grid
		let grid: GridItem[] = [];
		for (let i = 1; i <= daysInMonth[monthNum]; i++) {
			if (monthlyEvents[i]) {
				grid.push({
					day: i,
					events: monthlyEvents[i],
				});
			} else {
				grid.push({
					day: i,
				});
			}
		}
		return grid;
	};

	if (loading) {
		return <div className="content-wrapper loading">One moment please...</div>;
	}

	return (
		<div className="calendar-view">
			<div className="content-wrapper calendar-header">
				{[
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
					"Sunday",
				].map((day, index) => (
					<div className="weekday-wrapper" key={index}>
						<p className="weekday">{day}</p>
					</div>
				))}
			</div>

			<div className="calendar-grid">
				{generateCalendarGrid().map((gridItem, index) => {
					const initialWeekday = formatDay(day1.current.getDay());
					const currentWeekday = ((initialWeekday + gridItem.day - 1) % 7) + 1;
					const currentRow = calculateRow(initialWeekday, gridItem.day);

					const style: CSSProperties = {
						gridRow: `${currentRow}/${currentRow + 1}`,
						gridColumn: `${currentWeekday}/${currentWeekday + 1}`,
					};

					return (
						<div className="square-wrapper" key={gridItem.day} style={style}>
							{gridItem.events ? (
								<CalendarSquare day={gridItem.day} events={gridItem.events} />
							) : (
								<CalendarSquare day={gridItem.day} />
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

interface CalendarSquareProps {
	day: number;
	events?: FSEvent[];
}

function CalendarSquare({ day, events }: CalendarSquareProps) {
	return (
		<div className="grid-item-content">
			<p className="day-label">{day}</p>
			{events &&
				events.map((event, index) => {
					if (events.length > 2) {
						return (
							index < 2 && (
								<div key={event.eventId}>
									<CalendarEvent event={event} />
								</div>
							)
						);
					} else {
						return (
							<div key={event.eventId}>
								<CalendarEvent event={event} />
							</div>
						);
					}
				})}
			{events && events.length > 2 && <CalendarEvent seeMore />}
		</div>
	);
}

interface CalendarEventProps {
	event?: FSEvent | null;
	seeMore?: boolean;
}

function CalendarEvent({ event, seeMore = false }: CalendarEventProps) {
	if (seeMore) {
		return (
			<Link
				to={`/members/calendar/eventSummary?month=${event}&day=${event}&year=${event}`}
				key={new Date(Date.now()).getTime()}
			>
				<div className="event see-more">
					<p className="event-title">See all</p>
				</div>
			</Link>
		);
	}

	if (event) {
		return (
			<Link
				to={`/members/calendar/eventDetail?eventId=${event.eventId}`}
				key={event.eventId}
			>
				<div className="event">
					<p className="event-title">{event.title}</p>
				</div>
			</Link>
		);
	}

	return <div></div>;
}
