import * as React from "react";
import { useState, useEffect, useContext, Fragment } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../contexts/auth";
import { signOut } from "../utils/authentication";
import { BluffsUser } from "../utils/users";

import VerticalLine from "../vectors/VerticalLine";
import Login from "./Login";

const activeStyle = {
	textDecoration: "underline",
	textDecorationColor: "#EF233C",
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
				</div>

				<ul>
					<NavLink activeStyle={activeStyle} to="/swim">
						<p>Swim</p>
					</NavLink>
					<NavLink activeStyle={activeStyle} to="/tennis/">
						<p>Tennis</p>
					</NavLink>
					<NavLink activeStyle={activeStyle} to="/about/">
						<p>About</p>
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
