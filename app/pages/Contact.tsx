import * as React from "react";

import Header from "../components/Header";
import useCloudContent from "../hooks/useCloudContent";

export default function Contact() {
	const getContent = useCloudContent("contact");

	return (
		<div id="contact-wrapper">
			<Header text="contact" />
			<div className="content-wrapper">
				<>{getContent()}</>
			</div>
		</div>
	);
}
