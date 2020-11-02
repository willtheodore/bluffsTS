import * as React from "react";
import { useEffect, useState } from "react";

import { FSPost, getRecentPosts } from "../../utils/blog.js";
import BlogPost from "../BlogPost.js";

export default function RecentPosts() {
	const [posts, setPosts] = useState<FSPost[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		getPosts();
	}, []);

	const getPosts = async () => {
		try {
			const recentResults = await getRecentPosts(3);
			setPosts(recentResults.data ? recentResults.data : []);
		} catch (e) {
			setError(e.message);
		}
	};

	return (
		<div id="recent-posts">
			{posts != null && (
				<ul>
					{posts.map((post) => (
						<li key={post.datePosted}>
							<BlogPost
								title={post.title}
								authorName={post.authorName}
								date={
									post.formattedDate
										? post.formattedDate
										: "MM/DD/YYYY HH:MM AM"
								}
								content={post.content}
								postId={post.postId}
							/>
						</li>
					))}
				</ul>
			)}
			{error != null && <h2>{error}</h2>}
		</div>
	);
}
