import * as React from "react";
import {
	FaChevronRight,
	FaNewspaper,
	FaBox,
	FaCalendarAlt,
	FaPenSquare,
	FaUserAlt,
	FaUserTie,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import { parsePath } from "../../utils/formatters";

interface SidebarItemProps {
	title: string;
	isActive: boolean;
	children: JSX.Element;
	to: string;
}

function SidebarItem({ title, isActive, children, to }: SidebarItemProps) {
	let style = {};
	if (isActive) {
		style = {
			backgroundColor: "#FFCED4",
		};
	}
	return (
		<div className="sidebar-item" style={style}>
			{children}
			<Link to={to}>
				<p>{title}</p>
			</Link>
			{!isActive && <FaChevronRight />}
		</div>
	);
}

interface SidebarProps {
	isAdmin: boolean;
}

export default function Sidebar({ isAdmin }: SidebarProps) {
	const path = parsePath(document.location);

	return (
		<div id="sidebar-wrapper">
			<div className="sidebar">
				<SidebarItem
					title="Recent Posts"
					isActive={path[1] === "recent"}
					to="/members/recent"
				>
					<FaNewspaper />
				</SidebarItem>
				<SidebarItem
					title="Archive"
					isActive={path[1] === "archive"}
					to="/members/archive"
				>
					<FaBox />
				</SidebarItem>
				<SidebarItem
					title="Calendar"
					isActive={path[1] === "calendar"}
					to="/members/calendar"
				>
					<FaCalendarAlt />
				</SidebarItem>
				<SidebarItem
					title="Sign-ups"
					isActive={path[1] === "signups"}
					to="/members/signups"
				>
					<FaPenSquare />
				</SidebarItem>
				<SidebarItem
					title="Account"
					isActive={path[1] === "account"}
					to="/members/account"
				>
					<FaUserAlt />
				</SidebarItem>
				{isAdmin && (
					<SidebarItem
						title="Admin"
						isActive={path[1] === "admin"}
						to="/members/admin/createPost"
					>
						<FaUserTie />
					</SidebarItem>
				)}
			</div>
		</div>
	);
}
