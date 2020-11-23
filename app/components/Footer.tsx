import * as React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
	return (
		<div id="footer">
			<ul>
				<NavLink to="/swim">Swim</NavLink>
				<NavLink to="/tennis">Tennis</NavLink>
				<NavLink to="/about">Social</NavLink>
				<NavLink to="/contact">Contact</NavLink>
				<NavLink to="/jobs">Jobs</NavLink>
				<NavLink to="/application">Application</NavLink>
			</ul>
			<p>©Bedford Bluffs</p>
		</div>
	);
}
