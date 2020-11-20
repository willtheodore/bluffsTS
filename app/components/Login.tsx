import { isNull } from "lodash";
import * as React from "react";
import { RefObject, CSSProperties, ChangeEvent, Fragment } from "react";

import useHover from "../hooks/useHover";
import {
	validateEmail,
	validatePassword,
	signInUser,
	createAccount,
	confirmNotEmpty,
	addName,
	validateMemberCode,
} from "../utils/authentication";
import { addUserToFirestore } from "../utils/users";
import { SetState } from "./Selector";

export type InputEventHandler = (event: ChangeEvent<HTMLInputElement>) => void;
interface FormInputProps {
	setValue?: InputEventHandler | null;
	style?: CSSProperties;
	type?: string;
	reference?: RefObject<HTMLInputElement> | null;
	labelText: string;
}
interface LoginContentProps {
	setMode: SetState<string>;
	dismiss: VoidFunction;
}
interface LoginProps {
	dismiss: VoidFunction;
}

export function FormInput({
	setValue = null,
	style = {},
	type = "text",
	reference = null,
	labelText,
}: FormInputProps) {
	if (setValue)
		return (
			<div className="form-input">
				<label htmlFor={labelText}>{labelText}</label>
				<input style={style} type={type} id={labelText} onChange={setValue} />
			</div>
		);

	return (
		<div className="form-input">
			<label htmlFor={labelText}>{labelText}</label>
			<input style={style} type={type} id={labelText} ref={reference} />
		</div>
	);
}

function LoginContent({ setMode, dismiss }: LoginContentProps) {
	const [email, setEmail] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");
	const [emailStyle, setEmailStyle] = React.useState<CSSProperties>({
		color: "black",
	});
	const [passwordStyle, setPasswordStyle] = React.useState<CSSProperties>({
		color: "black",
	});
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		updateStyling();
	}, [email, password]);

	const updateStyling = () => {
		if (email.length < 1) {
			setEmailStyle({ color: "black" });
		}
		if (password.length < 1) {
			setPasswordStyle({ color: "black" });
		}

		try {
			if (validateEmail(email)) {
				setEmailStyle({ color: "green" });
			}
			if (validatePassword(password)) {
				setPasswordStyle({ color: "green" });
			}
		} catch (e) {
			if (e.message === "Invalid email") {
				setEmailStyle({ color: "red" });
			} else if (e.message === "Invalid password") {
				setPasswordStyle({ color: "red" });
			} else {
				setEmailStyle({ color: "red" });
				setPasswordStyle({ color: "red" });
			}
		}
	};

	const handleSubmit = async () => {
		try {
			const validEmail = validateEmail(email);
			const validPassword = validatePassword(password);
			if (validEmail && validPassword) {
				await signInUser(email, password);
				dismiss();
			}
		} catch (e) {
			setError(e.message);
		}
	};

	return (
		<Fragment>
			<div className="title">
				<h3>LOGIN</h3>
				<p className="error">{error}</p>
			</div>
			<FormInput
				setValue={(e) => setEmail(e.target.value)}
				labelText="email"
				style={emailStyle}
			/>
			<FormInput
				setValue={(e) => setPassword(e.target.value)}
				labelText="password"
				style={passwordStyle}
				type="password"
			/>
			<div className="buttons">
				<button
					onClick={() => setMode("create")}
					className="btn btn-bold-muted"
				>
					CREATE
				</button>
				<button onClick={handleSubmit} className="btn btn-bold-red">
					SUBMIT
				</button>
			</div>
		</Fragment>
	);
}

function CreateContent({ setMode, dismiss }: LoginContentProps) {
	const [error, setError] = React.useState(null);
	const email = React.createRef<HTMLInputElement>();
	const confirmEmail = React.createRef<HTMLInputElement>();
	const password = React.createRef<HTMLInputElement>();
	const confirmPassword = React.createRef<HTMLInputElement>();
	const firstName = React.createRef<HTMLInputElement>();
	const lastName = React.createRef<HTMLInputElement>();
	const memberCode = React.createRef<HTMLInputElement>();

	const handleCreate = async () => {
		if (
			isNull(email.current) ||
			isNull(password.current) ||
			isNull(firstName.current) ||
			isNull(lastName.current) ||
			isNull(confirmEmail.current) ||
			isNull(confirmPassword.current) ||
			isNull(memberCode.current)
		) {
			return;
		}
		const eVal = email.current.value;
		const pVal = password.current.value;
		const firstVal = firstName.current.value;
		const lastVal = lastName.current.value;
		const codeVal = memberCode.current.value;

		try {
			const notEmpty = confirmNotEmpty([firstVal, lastVal, eVal, pVal]);
			const emailsMatch = eVal === confirmEmail.current.value;
			const passwordsMatch = pVal === confirmPassword.current.value;
			const validEmail = validateEmail(eVal);
			const validPassword = validatePassword(pVal);

			const validCode = await validateMemberCode(codeVal);
			if (!validCode) {
				throw Error(
					"Member code is not valid. Please check with Bluffs admin to make sure you have the right code."
				);
			}

			if (
				notEmpty &&
				emailsMatch &&
				passwordsMatch &&
				validEmail &&
				validPassword
			) {
				await createAccount(eVal, pVal);
				await addName(firstVal, lastVal);
				await addUserToFirestore(eVal, firstVal, lastVal);
				dismiss();
			} else {
				throw Error(
					"Fields do not contain valid information. Make sure emails and passwords match and nothing is left blank."
				);
			}
		} catch (e) {
			setError(e.message);
		}
	};

	return (
		<Fragment>
			<div className="title">
				<h3>CREATE</h3>
				<p className="error">{error}</p>
			</div>
			<FormInput reference={firstName} labelText="first name" />
			<FormInput reference={lastName} labelText="last name" />
			<FormInput reference={email} labelText="email" />
			<FormInput reference={confirmEmail} labelText="confirm email" />
			<FormInput reference={password} type="password" labelText="password" />
			<FormInput
				type="password"
				reference={confirmPassword}
				labelText="confirm password"
			/>
			<FormInput reference={memberCode} labelText="member code" />
			<div className="buttons">
				<button onClick={() => setMode("login")} className="btn btn-bold-muted">
					BACK
				</button>
				<button onClick={handleCreate} className="btn btn-bold-red">
					CREATE ACCOUNT
				</button>
			</div>
		</Fragment>
	);
}

export default function Login({ dismiss }: LoginProps) {
	const [hovering, hoverRef] = useHover();
	const [mode, setMode] = React.useState<string>("login");

	const handleBgClick = () => {
		if (hovering === true) {
			return;
		} else {
			dismiss();
		}
	};

	return (
		<div className="modal-bg" onClick={handleBgClick}>
			<div className="modal-window login" ref={hoverRef}>
				{mode === "login" && (
					<LoginContent setMode={setMode} dismiss={dismiss} />
				)}
				{mode === "create" && (
					<CreateContent setMode={setMode} dismiss={dismiss} />
				)}
			</div>
		</div>
	);
}
