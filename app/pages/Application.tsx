import * as React from "react";
import { useEffect, useState } from "react";
import { getApplicationDownloadLink } from "../utils/jobs";

export default function Application() {
	const [donwloadLink, setDownloadLink] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		updateLink();
	}, []);

	const updateLink = async () => {
		const apiResponse = await getApplicationDownloadLink();
		if (apiResponse.message[0] !== "S") {
			setError(apiResponse.message);
			return;
		}
		setDownloadLink(apiResponse.data!);
	};

	if (error) {
		return (
			<div id="application" className="content-wrapper">
				<p className="error">{error}</p>
			</div>
		);
	}

	return (
		<div id="application" className="content-wrapper">
			<h1>Application</h1>
			<hr className="blue-hr" />
			<p>
				The bluffs is currently accepting applications for our upcoming season.
				Click the button below to download our application. For more info on how
				to fill out this application, please see the membership section of our
				contact page.
			</p>
			{donwloadLink && (
				<a href={donwloadLink} target="_blank" className="btn btn-bold-blue">
					DOWNLOAD
				</a>
			)}
		</div>
	);
}
