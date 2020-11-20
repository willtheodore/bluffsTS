import * as React from "react";
import { createRef, Fragment, useEffect, useState } from "react";
import { FaAngleDown, FaTrash } from "react-icons/fa";
import { isOfType } from "../../utils/formatters";

import {
	removeUserFromAdmins,
	getAdmins,
	getUsersByIds,
	searchForUserByEmail,
	addUserToAdmins,
	BluffsUser,
	DatabaseUser,
	setMemberCodeListener,
	changeMemberCode,
} from "../../utils/users";

interface ManageAdminsProps {
	user: BluffsUser;
}

export default function ManageAdmins({ user }: ManageAdminsProps) {
	const [admins, setAdmins] = useState<string[] | null>();
	const [memberCode, setMemberCode] = useState<string>();
	const [adminUserObjects, setAdminUserObjects] = useState<
		DatabaseUser[] | null
	>();
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<string | DatabaseUser | null>(null);
	const memberCodeRef = createRef<HTMLInputElement>();
	const newAdmin = createRef<HTMLInputElement>();

	useEffect(() => {
		initializeComponent();
	}, []);

	useEffect(() => {
		updateUsers();
	}, [admins]);

	const initializeComponent = async () => {
		await updateAdmins();
		setMemberCodeListener((code: string) => {
			setMemberCode(code);
		});
	};

	const updateAdmins = async () => {
		try {
			const adminsResult = await getAdmins();
			if (adminsResult.data) {
				let adminArr = [];
				for (const id in adminsResult.data) {
					adminArr.push(id);
				}
				setAdmins(adminArr);
				setError(null);
			}
		} catch (e) {
			setError(e.message);
		}
	};

	const updateUsers = async () => {
		try {
			if (!admins) {
				throw Error("Please wait a moment.");
			}
			const usersResult = await getUsersByIds(admins);
			setAdminUserObjects(usersResult.data);
			setError(null);
		} catch (e) {
			setError(e.message);
		}
	};

	const handleAdd = async () => {
		try {
			if (isOfType<DatabaseUser>(result, "uid")) {
				if (!result.uid) {
					return;
				}
				await addUserToAdmins(result.uid);
				setResult("Success! The user was added to the list of admins.");
				setError(null);
			} else {
				throw Error("Error getting result from search");
			}
		} catch (e) {
			setError(e.message);
		}
	};

	const handleSearch = async () => {
		try {
			if (!newAdmin.current) {
				throw Error("No value for a new admin");
			}
			const userResult = await searchForUserByEmail(newAdmin.current.value);
			setResult(userResult.data as DatabaseUser);
			setError(null);
		} catch (e) {
			setError(e.message);
		}
	};

	const handleChangeCode = async () => {
		if (!memberCodeRef.current || memberCodeRef.current.value === "") {
			setError("no value for member code input. Try again.");
			return;
		}
		const memberCodeVal = memberCodeRef.current.value;

		const apiResponse = await changeMemberCode(memberCodeVal);
		if (apiResponse.message[0] !== "S") {
			setError(apiResponse.message);
		}
		setError(null);
	};

	const getAdminInfo = (id: string): [string, string] => {
		if (!adminUserObjects) {
			return ["DISPLAYNAME", "EMAIL"];
		}

		for (const userObject of adminUserObjects) {
			if (userObject.uid! === id) {
				return [userObject.displayName, userObject.email];
			}
		}
		return ["DIPLAYNAME", "EMAIL"];
	};

	if (!admins || !adminUserObjects) {
		return (
			<div id="manage-admins">
				<div className="content-wrapper">
					<p>One moment please.</p>
				</div>
			</div>
		);
	}

	return (
		<div id="manage-admins">
			{error && (
				<div className="content-wrapper">
					<p className="error">{error}</p>
				</div>
			)}

			<div className="content-wrapper">
				<span>
					<h3>Exisiting admins:</h3>
					<FaAngleDown />
				</span>
				<ul className="admin-list">
					{admins.map((admin, index) => {
						const [name, email] = getAdminInfo(admin);

						return (
							<li key={admin}>
								<AdminRow
									name={name}
									email={email}
									id={admin}
									user={user as DatabaseUser}
								/>
							</li>
						);
					})}
				</ul>
			</div>

			{memberCode && (
				<div className="content-wrapper member-code">
					<h3>Manage admin code</h3>
					<p>Current code: {memberCode}</p>
					<div className="input-row">
						<input type="text" ref={memberCodeRef} />
						<button className="btn btn-bold-red" onClick={handleChangeCode}>
							CHANGE MEMBER CODE
						</button>
					</div>
				</div>
			)}

			<div className="content-wrapper">
				<span>
					<h3>Add new admins:</h3>
					<FaAngleDown />
				</span>
				<p>
					Please enter the email of the user you wish to grant admin
					priveledges.
				</p>
				<div className="input-field">
					<input type="text" ref={newAdmin} />
					<button onClick={handleSearch} className="btn btn-bold-red">
						SEARCH
					</button>
				</div>

				{result && (
					<div className="results-field">
						<>
							{isOfType<DatabaseUser>(result, "uid") && (
								<>
									<p>{`We were able to find ${result.displayName}. Add?`}</p>
									<button
										className="btn btn-bold-muted"
										onClick={() => setResult(null)}
									>
										CANCEL
									</button>
									<button className="btn btn-bold-red" onClick={handleAdd}>
										ADD USER TO ADMINS
									</button>
								</>
							)}

							{typeof result === "string" && <p>{result}</p>}
						</>
					</div>
				)}
			</div>
		</div>
	);
}

interface AdminRowProps {
	name: string;
	email: string;
	id: string;
	user: DatabaseUser;
}

function AdminRow({ name, email, id, user }: AdminRowProps) {
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [result, setResult] = useState<string | null>(null);

	const handleDelete = async (userId?: string) => {
		try {
			if (confirmDelete && userId) {
				await removeUserFromAdmins(userId);
				setResult(`${name} is no longer an admin.`);
			} else {
				setConfirmDelete(true);
			}
		} catch (e) {
			setResult(e.message);
		}
	};

	if (result) {
		return (
			<div className="admin-row">
				<p>{result}</p>
			</div>
		);
	}

	return (
		<>
			<p>{name}</p>
			<p>{email}</p>
			{user.uid != id &&
				(!confirmDelete ? (
					<FaTrash onClick={() => handleDelete()} className="pointer" />
				) : (
					<div className="buttons">
						<button
							className="btn btn-bold-muted"
							onClick={() => setConfirmDelete(false)}
						>
							BACK
						</button>
						<button
							className="btn btn-bold-red"
							onClick={() => handleDelete(id)}
						>
							CONFIRM
						</button>
					</div>
				))}
		</>
	);
}
