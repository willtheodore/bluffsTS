import * as React from "react";

import AboutHeader from "../vectors/AboutHeader.js";
import ContactHeader from "../vectors/ContactHeader.js";
import MembersHeader from "../vectors/MembersHeader.js";

interface HeaderProps {
	text: string;
}

export default function Header({ text }: HeaderProps) {
	return (
		<div className="header-comp">
			{text === "social" && <AboutHeader />}
			{text === "contact" && <ContactHeader />}
			{text === "members" && <MembersHeader />}
			<div>
				<h1>{text.toUpperCase()}</h1>
			</div>
		</div>
	);
}
