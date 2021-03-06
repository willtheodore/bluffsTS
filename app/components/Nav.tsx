import * as React from "react";
import { useState, useEffect, useContext, Fragment } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../contexts/auth";
import { signOut } from "../utils/authentication";
import { BluffsUser } from "../utils/users";

import VerticalLine from "../vectors/VerticalLine";
import BluffsLogo from "../vectors/bluffs-logo-white.svg";
import Login from "./Login";

const activeStyle = {
	textDecoration: "underline",
	textDecorationThickness: "3px",
	textDecorationColor: "#3892CC",
};

export default function Nav() {
	const [loginShowing, setLoginShowing] = useState<boolean>(false);
	const user: BluffsUser = useContext<BluffsUser>(AuthContext);
	const [membersPath, setMembersPath] = useState<string>("/members/");

	useEffect(() => {
		if (user != null) {
			setMembersPath("/members/recent");
		} else {
			setMembersPath("/members");
		}
	}, [user]);

	const handleLoginHit = () => {
		if (user === null) {
			setLoginShowing(true);
		} else {
			signOut();
		}
	};

	const dismiss = () => {
		setLoginShowing(false);
	};

	return (
		<Fragment>
			{loginShowing && <Login dismiss={dismiss} />}
			<nav>
				<div className="logotype">
					<NavLink to="/">Bedford Bluffs</NavLink>
					<VerticalLine />
					<img className="bluffs-logo" src={BluffsLogo} alt="Logo" />
				</div>

				<ul>
					<NavLink activeStyle={activeStyle} to="/swim">
						<p>Swim</p>
					</NavLink>
					<NavLink activeStyle={activeStyle} to="/tennis/">
						<p>Tennis</p>
					</NavLink>
					<NavLink activeStyle={activeStyle} to="/about/">
						<p>Social</p>
					</NavLink>
					<NavLink activeStyle={activeStyle} to="/contact/">
						<p>Contact</p>
					</NavLink>
					<NavLink activeStyle={activeStyle} to={membersPath}>
						<p>Members</p>
					</NavLink>
					<button onClick={handleLoginHit} className="btn">
						{user === null ? "Login" : "Sign Out"}
					</button>
				</ul>
			</nav>
		</Fragment>
	);
}
