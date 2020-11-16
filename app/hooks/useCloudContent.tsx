import * as React from "react";
import { useEffect, useState } from "react";
import { formatTabs } from "../utils/formatters";
import { getCloudContent } from "../utils/pages";

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
		setContent(apiReponse.data);
	};

	const getContent = () => {
		return content ? (
			<>
				{content.map((paragraph: string) => {
					return (
						<p
							style={{ whiteSpace: "pre" }}
							dangerouslySetInnerHTML={{ __html: formatTabs(paragraph) }}
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
