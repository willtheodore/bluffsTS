import * as React from "react";
import { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { formatLinks } from "../utils/formatters";

interface BlogPostProps {
	title: string;
	date: string;
	authorName: string;
	content: string;
	charLimit?: number | null;
	postId?: string | null;
}

export default function BlogPost({
	title,
	date,
	authorName,
	content,
	charLimit = null,
	postId = null,
}: BlogPostProps) {
	const styles = {
		container: {
			backgroundColor: "white",
			display: "flex",
			flexDirection: "column",
			borderRadius: "10px",
			padding: "10px",
			margin: "0 20px 20px",
			color: "black",
		},
		hr: {
			width: "100%",
			height: "0",
			margin: "5px 0",
			border: "none",
			borderBottom: "2px solid #3892CC",
		},
		header: {
			fontFamily: "heebo-medium",
			fontSize: "48px",
		},
		description: {
			fontFamily: "heebo-light",
			fontSize: "18px",
			color: "black",
			margin: "0",
		},
		content: {
			fontFamily: "heebo-regular",
			fontSize: "18px",
			margin: "0",
			whiteSpace: "pre-line",
		},
	};

	let newContent = content.slice();
	if (charLimit != null) {
		let target = charLimit;
		for (let i = 0; i < 40; i++) {
			const char = newContent.charAt(charLimit - 20 + i);
			if (char === "<") {
				target = charLimit - 20 + i;
			}
		}
		newContent = content.slice(0, target);
		newContent = newContent.concat(" ...");
	}

	const getHeader = () => {
		if (postId) {
			return (
				<Link className="red-hover" to={`/members/postDetail?postId=${postId}`}>
					<h2 className="red-hover" style={styles.header}>
						{title}
					</h2>
				</Link>
			);
		} else {
			return <h2 style={styles.header}>{title}</h2>;
		}
	};

	return (
		<div
			style={styles.container as CSSProperties}
			className="blog-post-container"
		>
			{getHeader()}
			<p style={styles.description}>{`by ${authorName} // posted ${date}`}</p>
			<hr style={styles.hr} />
			<p
				className="format-links"
				style={styles.content as CSSProperties}
				dangerouslySetInnerHTML={{ __html: formatLinks(newContent) }}
			/>
		</div>
	);
}
