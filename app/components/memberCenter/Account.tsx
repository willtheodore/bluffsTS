import * as React from "react";
import { createRef, useContext, useState } from "react";
import AuthContext from "../../contexts/auth";
import {
	BluffsUser,
	deleteAccountByUid,
	updateUserValues,
} from "../../utils/users";

export default function Account() {
	const user: BluffsUser = useContext(AuthContext);
	const [error, setError] = useState<string | null>();
	const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

	const handleDelete = async () => {
		const apiResponse = await deleteAccountByUid(user.uid);
		if (apiResponse.message[0] !== "S") setError(apiResponse.message);
	};

	return (
		<div id="account" className="content-wrapper">
			{error ? (
				<p className="error">{error}</p>
			) : (
				<>
					<EditField label="Display Name" propertyName="displayName" />
					<EditField label="Email" propertyName="email" />
					<EditField label="New Password" propertyName="password" confirm />

					{confirmDelete ? (
						<div className="delete-account">
							<button
								onClick={() => setConfirmDelete(false)}
								className="btn btn-light-muted"
							>
								BACK
							</button>
							<button onClick={handleDelete} className="btn btn-bold-red">
								CONFIRM
							</button>
						</div>
					) : (
						<button
							onClick={() => setConfirmDelete(true)}
							className="btn btn-bold-red delete-account"
						>
							DELETE THIS ACCOUNT
						</button>
					)}
				</>
			)}
		</div>
	);
}

interface EditFieldProps {
	propertyName: "displayName" | "email" | "password";
	label: string;
	confirm?: boolean;
}

function EditField({ propertyName, label, confirm = false }: EditFieldProps) {
	const [editValue, setEditValue] = useState<boolean>(false);
	const [result, setResult] = useState<string | null>(null);
	const user: BluffsUser = useContext(AuthContext);
	const newInput = createRef<HTMLInputElement>();
	const confirmInput = createRef<HTMLInputElement>();

	const confirmChanges = async () => {
		if (confirm && newInput.current && confirmInput.current) {
			const value = newInput.current.value;
			const confirmedValue = confirmInput.current.value;
			if (value !== confirmedValue) {
				setResult("Passwords do not match. Please try again.");
			} else {
				const apiResponse = await updateUserValues(propertyName, value);
				setResult(apiResponse.message);
			}
		}
		if (newInput.current) {
			const value = newInput.current.value;
			const apiResponse = await updateUserValues(propertyName, value);
			setResult(apiResponse.message);
		}
	};

	const getButtons = () => {
		return !editValue ? (
			<button
				onClick={() => setEditValue(true)}
				className="btn btn-regular-blue"
			>
				{confirm ? "EDIT VALUES" : "EDIT VALUE"}
			</button>
		) : (
			<>
				<button onClick={confirmChanges} className="btn btn-bold-blue">
					CONFRIM CHANGES
				</button>
				<button
					onClick={() => setEditValue(false)}
					className="btn btn-light-muted"
				>
					CANCEL
				</button>
			</>
		);
	};

	if (result) {
		return (
			<div className="edit-field">
				<p className="result">{result}</p>
			</div>
		);
	}

	return (
		<>
			<div className="edit-field">
				<label htmlFor={`${propertyName}-input`}>{label}</label>
				<div className="fields">
					<input
						id={`${propertyName}-input`}
						ref={newInput}
						disabled={!editValue}
						type="text"
						placeholder={propertyName !== "password" ? user[propertyName]! : ""}
					/>
					{!confirm && getButtons()}
				</div>
			</div>

			{confirm && (
				<div className="edit-field">
					<label htmlFor={`confirm-${propertyName}-input`}>
						Confirm {label}
					</label>
					<div className="fields">
						<input
							type="text"
							ref={confirmInput}
							id={`confirm-${propertyName}-input`}
							disabled={!editValue}
						/>
						{getButtons()}
					</div>
				</div>
			)}
		</>
	);
}
