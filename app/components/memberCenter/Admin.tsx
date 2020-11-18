import * as React from "react";
import { useContext, Suspense } from "react";
import {
	FaPencilAlt,
	FaEdit,
	FaLock,
	FaCalendar,
	FaParagraph,
} from "react-icons/fa";

import AuthContext from "../../contexts/auth";
import Selector from "../Selector";
import { parsePath } from "../../utils/formatters";
import { BluffsUser } from "../../utils/users";
import EditPages from "./EditPages";

const CreatePost = React.lazy(() => import("./CreatePost"));
const CalendarEvents = React.lazy(() => import("./CalendarEvents"));
const ManagePosts = React.lazy(() => import("./ManagePosts"));
const ManageAdmins = React.lazy(() => import("./ManageAdmins"));

export default function Admin() {
	const user: BluffsUser = useContext<BluffsUser>(AuthContext);
	const path = parsePath(document.location);
	const pathInContext = path[2];

	if (!user.isAdmin) {
		return (
			<div id="admin">
				<div className="content-wrapper">
					<p>You must be an admin to view this page.</p>
				</div>
			</div>
		);
	}

	return (
		<div id="admin">
			<Selector
				className="admin-selector"
				icons={[
					<FaPencilAlt />,
					<FaEdit />,
					<FaCalendar />,
					<FaLock />,
					<FaParagraph />,
				]}
				items={[
					"Create Post",
					"Manage Posts",
					"Calendar Events",
					"Manage Admins",
					"Edit Pages",
				]}
				linkDestinations={[
					"createPost",
					"managePosts",
					"calendarEvents",
					"manageAdmins",
					"editPages",
				]}
			/>
			<Suspense
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
				{pathInContext === "createPost" && <CreatePost user={user} />}
				{pathInContext === "managePosts" && <ManagePosts />}
				{pathInContext === "calendarEvents" && <CalendarEvents />}
				{pathInContext === "manageAdmins" && <ManageAdmins user={user} />}
				{pathInContext === "editPages" && <EditPages user={user} />}
			</Suspense>
		</div>
	);
}
