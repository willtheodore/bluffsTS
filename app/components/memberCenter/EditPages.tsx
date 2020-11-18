import * as React from "react";
import { createRef, useEffect, useState } from "react";
import {
	FaCheckCircle,
	FaMinusCircle,
	FaPencilAlt,
	FaPlusCircle,
} from "react-icons/fa";
import {
	changeParagraphByNumber,
	setCloudContentListener,
	FSParagraph,
	deleteParagraph as deleteParagraphByPage,
	addParagraphBelowNumber,
} from "../../utils/pages";
import { BluffsUser } from "../../utils/users";
import Selector from "../Selector";

interface EditPagesProps {
	user: BluffsUser;
}

export default function EditPages({ user }: EditPagesProps) {
	const [page, setPage] = useState<string>("Home");
	const [pageData, setPageData] = useState<FSParagraph[] | null>();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		updatePageData(page);
	}, [page]);

	const updatePageData = async (pageID: string) => {
		const apiResponse = await setCloudContentListener(
			pageID.toLowerCase(),
			(pageArray: FSParagraph[]) => {
				setPageData(pageArray);
			}
		);

		if (!apiResponse.data) {
			setError(apiResponse.message);
			return;
		}
		const unsub = apiResponse.data;
		return () => unsub();
	};

	const changeParagraph = async (text: string, paragraphNumber: number) => {
		const apiResponse = await changeParagraphByNumber(
			text,
			paragraphNumber,
			page.toLowerCase()
		);
		if (apiResponse.message[0] !== "S") {
			setError(apiResponse.message);
		}
	};

	const deleteParagraph = async (paragraph: FSParagraph) => {
		const apiResponse = await deleteParagraphByPage(
			paragraph,
			page.toLowerCase()
		);
		if (apiResponse.message[0] !== "S") {
			setError(apiResponse.message);
		}
	};

	const addParagraph = async (numberAboveNew: number) => {
		if (!pageData) {
			setError(
				"No data here. Weird. Try again. If you keep having issues, call (603) 213-1011"
			);
			return;
		}
		const apiResponse = await addParagraphBelowNumber(
			numberAboveNew,
			page.toLowerCase(),
			pageData
		);
		if (apiResponse.message[0] !== "S") {
			setError(apiResponse.message);
		}
	};

	if (error) {
		return (
			<div id="edit-pages" className="content-wrapper">
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div id="edit-pages">
			<Selector
				title="Page"
				preSelected="Home"
				setState={setPage}
				items={["Home", "Swim", "Tennis", "Social", "Contact"]}
			/>
			<div className="content-wrapper">
				{pageData &&
					pageData.map((paragraph: FSParagraph) => (
						<div key={paragraph.paragraphNumber}>
							<div className="edit-paragraph">
								<EditParagraph
									paragraph={paragraph.content}
									updateParagraph={(text) =>
										changeParagraph(text, paragraph.paragraphNumber)
									}
									handleDelete={() => deleteParagraph(paragraph)}
								/>
							</div>
							<FaPlusCircle
								className="add-paragraph"
								onClick={() => addParagraph(paragraph.paragraphNumber)}
								size={40}
								color="#3892CC"
							/>
						</div>
					))}
			</div>
		</div>
	);
}

interface EditParagraphProps {
	paragraph: string;
	updateParagraph: (text: string) => void;
	handleDelete: VoidFunction;
}

function EditParagraph({
	paragraph,
	updateParagraph,
	handleDelete,
}: EditParagraphProps) {
	const inputRef = createRef<HTMLTextAreaElement>();
	const [edit, setEdit] = useState<boolean>(false);
	const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = paragraph;
		}
	});

	const saveChanges = async () => {
		setEdit(false);
		if (!inputRef.current) {
			return;
		}

		updateParagraph(inputRef.current.value);
	};

	return (
		<>
			{!edit ? (
				<FaPencilAlt
					className="pointer"
					size={40}
					onClick={() => setEdit(true)}
				/>
			) : (
				<FaCheckCircle className="pointer" size={40} onClick={saveChanges} />
			)}
			<textarea
				className="edit-paragraph-body"
				ref={inputRef}
				disabled={!edit}
			/>
			{edit && confirmDelete && (
				<div className="buttons">
					<button className="btn btn-bold-blue" onClick={handleDelete}>
						CONFIRM
					</button>
					<button
						className="btn btn-light-muted"
						onClick={() => setConfirmDelete(false)}
					>
						CANCEL
					</button>
				</div>
			)}
			{edit && !confirmDelete && (
				<FaMinusCircle
					className="minus"
					size={40}
					onClick={() => setConfirmDelete(true)}
				/>
			)}
		</>
	);
}
