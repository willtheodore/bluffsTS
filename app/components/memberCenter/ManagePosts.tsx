import * as React from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

import AuthContext from "../../contexts/auth";
import {
	BluffsUser,
	DatabaseUser,
	getUserById,
	removePostFromUserObject,
} from "../../utils/users";
import {
	setPostListenerByIds,
	deletePostById,
	updatePostTitleAndContent,
	FSPost,
} from "../../utils/blog";

import BlogPost from "../BlogPost";
import { PostEditor } from "./CreatePost";
import { createRef, Fragment, useContext, useEffect, useState } from "react";

export default function ManagePosts() {
	const user: BluffsUser = useContext<BluffsUser>(AuthContext);
	const [posts, setPosts] = useState<FSPost[] | null>(null);
	const [userObj, setUserObj] = useState<DatabaseUser | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [edit, setEdit] = useState<FSPost | null>(null);
	const [deletePost, setDeletePost] = useState<string | null>(null);

	useEffect(() => {
		getUser();
	}, [user]);

	useEffect(() => {
		if (userObj && userObj.posts) {
			const unsubscriber = setPostListenerByIds(userObj.posts, setPosts);
			return () => {
				unsubscriber();
			};
		} else {
			setPosts(null);
		}
	}, [userObj]);

	const getUser = async () => {
		try {
			if (user) {
				const userResult = await getUserById(user.uid);
				setUserObj(userResult.data);
			} else setUserObj(null);
		} catch (e) {
			setError(e.message);
		}
	};

	const handleDelete = async (id?: string) => {
		try {
			if (deletePost) {
				const postId = deletePost;
				await deletePostById(postId);
				setDeletePost(`success: ${postId}`);
				await removePostFromUserObject(user.uid, postId);
				setDeletePost(null);
			} else if (id) {
				setDeletePost(id);
			} else {
				throw Error("Refresh the page. This shouldn't happen.");
			}
		} catch (e) {
			setError(e.message);
		}
	};

	const getPostsContent = () => (
		<ul className="posts">
			{posts &&
				posts.map((post) => (
					<li key={post.postId}>
						<div>
							{deletePost != post.postId &&
							deletePost != `success: ${post.postId}` ? (
								<Fragment>
									<FaPencilAlt
										className="pointer"
										size={38}
										onClick={() => setEdit(post)}
									/>
									<FaTrash
										className="pointer"
										size={38}
										onClick={() => handleDelete(post.postId)}
									/>
								</Fragment>
							) : (
								deletePost != `success: ${post.postId}` && (
									<Fragment>
										<button
											className="btn btn-bold-muted"
											onClick={() => setDeletePost(null)}
										>
											BACK
										</button>
										<button
											className="btn btn-bold-red"
											onClick={() => handleDelete()}
										>
											CONFIRM
										</button>
									</Fragment>
								)
							)}
						</div>
						{!deletePost || deletePost != `success: ${post.postId}` ? (
							<BlogPost
								title={post.title}
								authorName={post.authorName}
								date={
									post.formattedDate
										? post.formattedDate
										: "MM/DD/YYYY HH:MM AM"
								}
								content={post.content}
								charLimit={500}
								postId={post.postId}
							/>
						) : (
							<div className="content-wrapper success-message">
								<p>Success! This post was deleted.</p>
							</div>
						)}
					</li>
				))}
		</ul>
	);

	if (error) {
		return (
			<div id="manage-posts" className="content-wrapper">
				<p className="error">{error}</p>
			</div>
		);
	}

	return (
		<div id="manage-posts">
			<div className="manage-posts-header">
				{edit != null ? (
					<Fragment>
						<h2>Edit Posts</h2>
						<button
							className="btn btn-bold-muted"
							onClick={() => setEdit(null)}
						>
							Back
						</button>
					</Fragment>
				) : (
					<h2>Your posts</h2>
				)}
			</div>
			<hr />
			{!edit ? getPostsContent() : <EditPost postObj={edit} />}
		</div>
	);
}

interface EditPostProps {
	postObj: FSPost;
}

function EditPost({ postObj }: EditPostProps) {
	const title = createRef<HTMLInputElement>();
	const content = createRef<HTMLTextAreaElement>();
	const [result, setResult] = useState<string | null>(null);

	const handleSubmit = async () => {
		try {
			if (title.current && content.current) {
				await updatePostTitleAndContent(
					postObj.postId!,
					title.current.value,
					content.current.value
				);
				setResult("success");
			}
		} catch (e) {
			setResult(e.message);
		}
	};

	return (
		<div id="edit-post" className="content-wrapper">
			{result != null ? (
				result === "success" ? (
					<p>Success! Your post has been edited.</p>
				) : (
					<p className="error">{result}</p>
				)
			) : (
				<PostEditor
					titleReference={title}
					contentReference={content}
					handleSubmit={handleSubmit}
					titleDefault={postObj.title}
					contentDefault={postObj.content}
				/>
			)}
		</div>
	);
}
