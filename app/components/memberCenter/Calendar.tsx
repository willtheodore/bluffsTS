import * as React from "react";
import { parsePath } from "../../utils/formatters";

import CalendarMain from "./CalendarMain";
import EventDetail from "./EventDetail";

export default function Calendar() {
	const path = parsePath(document.location);

	return (
		<React.Suspense
			fallback={
				<div
					style={{
						width: "100%",
						height: "100%",
						backgroundColor: "#1E2562",
						color: "white",
						position: "absolute",
						top: "50%",
						left: "20%",
					}}
				></div>
			}
		>
			<div id="calendar">
				{path[2] === undefined && <CalendarMain />}
				{path[2] === "eventDetail" && <EventDetail />}
			</div>
		</React.Suspense>
	);
}
