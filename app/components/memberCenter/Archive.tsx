import * as React from "react";
import { FSPost, getPostsByDate } from "../../utils/blog";
import { formatPosts } from "../../utils/formatters";

import Selector from "../Selector";
import BlogPost from "../BlogPost";

interface FSPostArchive {
	[key: string]: FSPost[];
}

export default function Archive() {
	const [month, setMonth] = React.useState<string | null>(null);
	const [year, setYear] = React.useState<number | null>(null);
	const [posts, setPosts] = React.useState<FSPostArchive | null>(null);
	const [error, setError] = React.useState<string | null>(null);
	const years = getYears();

	React.useEffect(() => {
		getPostsForArchive();
	}, [month, year]);

	const getPostsForArchive = async () => {
		try {
			if (month && year) {
				const apiResponse = await getPostsByDate(month, year);
				if (!apiResponse.data) {
					throw Error(apiResponse.message);
				}

				setPosts((prevPosts: FSPostArchive) => ({
					[`${month}/${year}`]: formatPosts(apiResponse.data!),
					...prevPosts,
				}));
				setError(null);
			} else {
				throw Error("No value for the month and/or year. Select a value.");
			}
		} catch (e) {
			setError(e.message);
		}
	};

	return (
		<div id="archive">
			<Selector
				title="Month"
				items={[
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				]}
				setState={setMonth}
				preSelected={getMonth()}
			/>
			<Selector title="Year" items={years} setState={setYear} />

			{error && <div className="content-wrapper error">{error}</div>}
			{posts != null && posts[`${month}/${year}`] != null && (
				<ul>
					{posts[`${month}/${year}`].map((post) => (
						<li key={post.postId}>
							<BlogPost
								title={post.title}
								authorName={post.authorName}
								date={
									post.formattedDate
										? post.formattedDate
										: "MM/HH/YYYY at HH:MM AM"
								}
								content={post.content}
								charLimit={500}
								postId={post.postId}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export function getYears() {
	const current = new Date(Date.now());
	const year = current.getFullYear();
	let years = new Array();
	years.push(year);
	for (let i = 1; i < 5; i++) {
		const j = year - i;
		years.push(j);
	}
	return years;
}

export function getMonth() {
	const current = new Date(Date.now());
	const month = current.getMonth();
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	return months[month];
}
