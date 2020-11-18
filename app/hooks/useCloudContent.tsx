import * as React from "react";
import { useEffect, useState } from "react";
import { formatLinks } from "../utils/formatters";
import { FSParagraph, getCloudContent } from "../utils/pages";

type JSXFunction = () => JSX.Element;

export default function useCloudContent(requestId: string): JSXFunction {
	const [content, setContent] = useState<string[] | null>();

	useEffect(() => {
		updateContent();
	}, []);

	const updateContent = async () => {
		const apiReponse = await getCloudContent(requestId);
		if (!apiReponse.data) {
			setContent([apiReponse.message]);
			return;
		}

		const result: string[] = apiReponse.data.map(
			(paragraph: FSParagraph) => paragraph.content
		);

		setContent(result);
	};

	const getContent = () => {
		return content ? (
			<>
				{content.map((paragraph: string) => {
					return (
						<p
							key={paragraph.slice(0, 20)}
							style={{ whiteSpace: "pre-wrap" }}
							dangerouslySetInnerHTML={{ __html: formatLinks(paragraph) }}
						></p>
					);
				})}
			</>
		) : (
			<p>One moment please.</p>
		);
	};

	return getContent;
}
