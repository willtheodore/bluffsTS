import * as React from "react";

import { formatPosts } from "../../utils/formatters";
import { FSPost, setPostListenerById } from "../../utils/blog";
import { parseSearch } from "../../utils/formatters";

import BlogPost from "../BlogPost";
import Comments from "../Comments";

export default function PostDetail() {
	const [post, setPost] = React.useState<FSPost | null>(null);
	const unsubscribe = React.useRef<VoidFunction | null>(null);
	const search = parseSearch(document.location);

	React.useEffect(() => {
		if (search.postId) {
			const unsub = setPostListenerById(search.postId, (postData: FSPost) => {
				setPost(formatPosts([postData])[0]);
				unsubscribe.current = unsub;
			});
		}
		return () => {
			unsubscribe.current && unsubscribe.current();
		};
	}, []);

	return (
		<div id="post-detail">
			{post != null && (
				<React.Fragment>
					<BlogPost
						title={post.title}
						authorName={post.authorName}
						date={
							post.formattedDate ? post.formattedDate : "MM/DD/YYYY HH:MM AM"
						}
						content={post.content}
					/>
					<Comments
						comments={post.comments ? post.comments : {}}
						postId={search.postId}
					/>
				</React.Fragment>
			)}
		</div>
	);
}
