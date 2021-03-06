import * as React from "react";
import AuthContext from "../contexts/auth";
import { parsePath } from "../utils/formatters";
import { BluffsUser } from "../utils/users";

const RecentPosts = React.lazy(
	() => import("../components/memberCenter/RecentPosts")
);
const Archive = React.lazy(() => import("../components/memberCenter/Archive"));
const Calendar = React.lazy(
	() => import("../components/memberCenter/Calendar")
);
const Account = React.lazy(() => import("../components/memberCenter/Account"));
const Admin = React.lazy(() => import("../components/memberCenter/Admin"));
const PostDetail = React.lazy(
	() => import("../components/memberCenter/PostDetail")
);
import Sidebar from "../components/memberCenter/Sidebar";
import Header from "../components/Header";

export default function Members() {
	const user: BluffsUser = React.useContext(AuthContext);
	const location = document.location;
	const pathElements = parsePath(location);

	const getHeader = () => {
		if (pathElements[1] === "recent") return "Recent Posts";
		if (pathElements[1] === "archive") return "Post Archive";
		if (pathElements[1] === "calendar") return "Event Calendar";
		if (pathElements[1] === "account") return "Account Settings";
		if (pathElements[1] === "admin") return "Admin Center";
		if (pathElements[1] === "postDetail") return "";
	};

	if (user === null) {
		return (
			<div id="members-wrapper">
				<Header text="members" />
				<div className="content-wrapper">
					<h2>This page can only be viewed by members who are logged in.</h2>
					<h6>
						To learn more about becoming a member, please view our{" "}
						<a href="/application"> application </a>
						or visit our <a href="/contact">contact page.</a>
					</h6>
				</div>
			</div>
		);
	}

	return (
		<div id="member-center">
			<h1>{getHeader()}</h1>
			<div
				id="center-flow"
				style={{ flexDirection: window.innerWidth > 700 ? "row" : "column" }}
			>
				<Sidebar isAdmin={user.isAdmin ? user.isAdmin : false} />
				<React.Suspense
					fallback={
						<div
							style={{
								width: "100%",
								height: "60px",
								backgroundColor: "#1E2562",
								color: "white",
								position: "absolute",
								top: "50%",
								left: "20%",
							}}
						></div>
					}
				>
					{(pathElements[1] === "recent" || !pathElements[1]) && (
						<RecentPosts />
					)}
					{pathElements[1] === "archive" && <Archive />}
					{pathElements[1] === "calendar" && <Calendar />}
					{pathElements[1] === "account" && <Account />}
					{pathElements[1] === "admin" && <Admin />}
					{pathElements[1] === "postDetail" && <PostDetail />}
				</React.Suspense>
			</div>
		</div>
	);
}
