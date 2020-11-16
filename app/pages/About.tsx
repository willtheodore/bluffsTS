import * as React from "react";
import aboutImage from "../images/aboutImage.jpg";

import Header from "../components/Header";
import useCloudContent from "../hooks/useCloudContent";

export default function About() {
	const getContent = useCloudContent("social");

	return (
		<div id="about-wrapper">
			<Header text="social" />
			<div className="content-wrapper">
				<div className="float-right">
					<img src={aboutImage} alt="People enjoying the bluffs" />
				</div>
				{getContent()}
			</div>
		</div>
	);
}
