import * as React from "react";

import HorizonalBreakSm from "../vectors/HorizontalBreakSm";
import carousel1 from "../images/carousel1.jpg";
import carousel2 from "../images/carousel2.jpg";
import useCloudContent from "../hooks/useCloudContent";

// Main home page for the site
export default function Home() {
	const getContent = useCloudContent("home");

	return (
		<React.Fragment>
			<div className="carousel">
				<img
					id="carousel1"
					src={carousel1}
					alt="A group of families stand on a tennis court"
				/>
				<img
					id="carousel2"
					src={carousel2}
					alt="A group of kids play in a pool."
				/>
			</div>
			<div className="content-wrapper cloud-content" id="home-wrapper">
				<h1>The Best Way to Spend Your Family's Summer.</h1>
				<HorizonalBreakSm />
				{getContent()}
			</div>
		</React.Fragment>
	);
}
