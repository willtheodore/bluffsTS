import * as React from "react";
import { createRef, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import {
	deleteJobPosting,
	JobPosting,
	setPostingListener,
	postJob as postJobToStorageAndDatabase,
} from "../../utils/jobs";
import { FormInput } from "../Login";

export default function PostJobs() {
	const [jobs, setJobs] = useState<JobPosting[] | null>();
	const [confirmDelete, setConfirmDelete] = useState<string>("");
	const [error, setError] = useState<string | null>();
	const titleRef = createRef<HTMLInputElement>();
	const seasonRef = createRef<HTMLInputElement>();
	const categoryRef = createRef<HTMLInputElement>();
	const fileRef = createRef<HTMLInputElement>();

	useEffect(() => {
		const unsub = updateJobs();
		return unsub;
	}, []);

	const updateJobs = (): VoidFunction => {
		const apiResponse = setPostingListener((postings) => {
			setJobs(postings);
		});
		if (!apiResponse.data) {
			setError(apiResponse.message);
			return () => {};
		}
		return apiResponse.data;
	};

	const postJob = async () => {
		if (
			!titleRef.current ||
			!seasonRef.current ||
			!categoryRef.current ||
			!fileRef.current ||
			!fileRef.current.files
		)
			return;
		const title = titleRef.current.value;
		const season = seasonRef.current.value;
		const category = categoryRef.current.value;
		const file = fileRef.current.files[0];
		if (title === "" || season === "" || category === "" || file === null)
			return;
		debugger;

		const apiResponse = await postJobToStorageAndDatabase(
			title,
			season,
			category,
			file
		);
		if (apiResponse.message[0] !== "S") setError(apiResponse.message);
	};

	const deleteJob = async (job: JobPosting) => {
		const apiResponse = await deleteJobPosting(job);
		if (apiResponse.message[0] !== "S") setError(apiResponse.message);
	};

	const getYear = () => {
		const currentDate = new Date(Date.now());
		return currentDate.getFullYear();
	};

	if (error) {
		return (
			<div id="post-jobs" className="content-wrapper">
				<p className="error">{error}</p>
			</div>
		);
	}

	return (
		<div id="post-jobs">
			<div className="content-wrapper create-posting">
				<h2>Create a Job Posting</h2>
				<hr className="blue-hr" />
				<form>
					<FormInput labelText="title" reference={titleRef} />
					<FormInput
						labelText="season"
						placeholder={`i.e. ${getYear()}`}
						reference={seasonRef}
					/>
					<FormInput
						labelText="category"
						reference={categoryRef}
						placeholder={`i.e. Pool, Tennis, Grounds`}
					/>
					<div className="form-input file">
						<label htmlFor="file-input">application file</label>
						<input ref={fileRef} id="file-input" type="file" />
					</div>
				</form>
				<button onClick={postJob} className="btn btn-bold-blue">
					POST JOB
				</button>
			</div>

			<div className="content-wrapper delete-postings">
				<h2>Delete a Job Posting</h2>
				<hr className="blue-hr" />
				{jobs &&
					jobs.map((job: JobPosting) => (
						<div className="posting" key={job.fileName}>
							<h4>{job.title}</h4>
							{confirmDelete === job.fileName ? (
								<div>
									<button
										onClick={() => setConfirmDelete("")}
										className="btn btn-light-muted"
									>
										BACK
									</button>
									<button
										onClick={() => deleteJob(job)}
										className="btn btn-bold-blue"
									>
										SUBMIT
									</button>
								</div>
							) : (
								<FaTrash
									className="pointer"
									color="#3892CC"
									onClick={() => setConfirmDelete(job.fileName)}
									size={24}
								/>
							)}
						</div>
					))}
			</div>
		</div>
	);
}
