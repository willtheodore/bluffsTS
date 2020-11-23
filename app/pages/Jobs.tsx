import * as React from "react";
import { useEffect, useState } from "react";
import { SetState } from "../components/Selector";
import useCloudContent from "../hooks/useCloudContent";

import {
	getPostings,
	getPostingUrlByFilename,
	JobPosting,
} from "../utils/jobs";

export default function Jobs() {
	const [postings, setPostings] = useState<JobPosting[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const getContent = useCloudContent("jobs");

	useEffect(() => {
		updatePostings();
	}, []);

	const updatePostings = async () => {
		const apiResponse = await getPostings();
		if (apiResponse.message[0] !== "S" || !apiResponse.data) {
			setError(apiResponse.message);
			return;
		}
		setPostings(apiResponse.data);
		setError(null);
	};

	return (
		<div id="jobs">
			<div className="content-wrapper info">
				<h1>Jobs</h1>
				<hr />
				<>{getContent()}</>
				{error && <p className="error">{error}</p>}
			</div>

			{postings && !error && (
				<ul className="job-postings">
					{postings.map((posting: JobPosting) => (
						<li key={posting.fileName}>
							<PostingDetail posting={posting} setError={setError} />
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

interface PostingDetailProps {
	posting: JobPosting;
	setError: SetState<string>;
}
function PostingDetail({ posting, setError }: PostingDetailProps) {
	const [downloadLink, setDownloadLink] = useState<string | null>();

	const showPosting = async () => {
		const apiResponse = await getPostingUrlByFilename(posting.fileName);
		const postingUrl = apiResponse.data;
		debugger;
		if (apiResponse.message[0] !== "S" || !postingUrl) {
			setError(
				"I'm sorry. We could't find that file. Send us an email instead."
			);
			return;
		}
		setDownloadLink(postingUrl);
	};

	return (
		<div className="posting-detail content-wrapper">
			<h2>{posting.title}</h2>
			<hr />
			<div className="detail-info">
				<div className="tags">
					<p className="category">
						<b>Category:</b> {posting.category}
					</p>
					<p className="season">
						<b>Season:</b> {posting.season}
					</p>
				</div>
				{downloadLink ? (
					<a
						className="btn btn-bold-blue link"
						href={downloadLink}
						target="_blank"
					>
						DOWNLOAD APPLICATION
					</a>
				) : (
					<button className="btn btn-bold-blue" onClick={showPosting}>
						GET APPLICATION DONWLOAD LINK
					</button>
				)}
			</div>
		</div>
	);
}
