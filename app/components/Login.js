import { update } from "lodash"
import React from "react"
import useHover from "../hooks/useHover"

import { validateEmail, validatePassword, signInUser, createAccount, confirmMatch, confirmNotEmpty, addName } from "../utils/authentication"
import { addUserToFirestore } from "../utils/users"

export function FormInput({ setValue = null, style = null, labelText, type = "text", reference = null }) {

  if (setValue) return (
    <div className="form-input">
      <label
        htmlFor={labelText}>
        {labelText}
      </label>
      <input
        style={style}
        type={type}
        id={labelText}
        onChange={setValue} />
    </div>
  )

  return (
    <div className="form-input">
      <label
        htmlFor={labelText}>
        {labelText}
      </label>
      <input
        style={style}
        type={type}
        id={labelText}
        ref={reference} />
    </div>
  )
}

function LoginContent({ setMode, dismiss }) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [emailStyle, setEmailStyle] = React.useState({ color: "black" })
  const [passwordStyle, setPasswordStyle] = React.useState({ color: "black" })
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    updateStyling()
  }, [email, password])

  const updateStyling = () => {
    if (email.length < 1) { setEmailStyle({ color: "black" }) }
    if (password.length < 1) { setPasswordStyle({ color: "black" }) }

    try {
      if (validateEmail(email)) {
        setEmailStyle({ color: "green"})
      }
      if (validatePassword(password)) {
        setPasswordStyle({ color: "red" })
      }
    } catch (e) {
      if (e.message === "Invalid email" ) {
        setEmailStyle({ color: "red" })
      } else if (e.message === "Invalid password" ) {
        setPasswordStyle({ color: "red" })
      } else {
        setEmailStyle({ color: "red" })
        setPasswordStyle({ color: "red" })
      }
    }
  }

  const handleSubmit = async () => {
    try {
      const validEmail = validateEmail(email)
      const validPassword = validatePassword(password)
      if (validEmail && validPassword) {
        await signInUser(email, password)
        dismiss()
      } 
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <React.Fragment>
      <div className="title">
        <h3>LOGIN</h3>
        <p className="error">{error}</p>
      </div>
      <FormInput
        setValue={e => setEmail(e.target.value)}
        labelText="email"
        style={emailStyle}
      />
      <FormInput
        setValue={e => setPassword(e.target.value)}
        labelText="password"
        style={passwordStyle}
        type="password"
      />
      <div className="buttons">
        <button
          onClick={() => setMode("create")}
          className="btn btn-bold-muted">
          CREATE
        </button>
        <button
          onClick={handleSubmit}
          className="btn btn-bold-red">
          SUBMIT
        </button>
      </div>
    </React.Fragment>
  )
}

function CreateContent({ setMode, dismiss }) {
  const [error, setError] = React.useState(null)
  const email = React.useRef(null)
  const confirmEmail = React.useRef(null)
  const password = React.useRef(null)
  const confirmPassword = React.useRef(null)
  const firstName = React.useRef(null)
  const lastName = React.useRef(null)

  const handleCreate = async () => {
    const eVal = email.current.value
    const pVal = password.current.value
    const firstVal = firstName.current.value
    const lastVal = lastName.current.value

    try {
      const notEmpty = confirmNotEmpty([firstVal, lastVal, eVal, pVal])
      const emailsMatch = eVal === confirmEmail.current.value
      const passwordsMatch = pVal === confirmPassword.current.value
      const validEmail = validateEmail(eVal)
      const validPassword = validatePassword(pVal)

      if (notEmpty && emailsMatch && passwordsMatch && validEmail && validPassword) {
        await createAccount(eVal, pVal)
        await addName(firstVal, lastVal)
        await addUserToFirestore(eVal, firstVal, lastVal)
        dismiss()
      } else {
        throw Error("Fields do not contain valid information. Make sure emails and passwords match and nothing is left blank.")
      }
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <React.Fragment>
      <div className="title">
        <h3>CREATE</h3>
        <p className="error">{error}</p>
      </div>
      <FormInput
        reference={firstName}
        labelText="first name"
      />
      <FormInput
        reference={lastName}
        labelText="last name"
      />
      <FormInput
        reference={email}
        labelText="email"
      />
      <FormInput
        reference={confirmEmail}
        labelText="confirm email"
      />
      <FormInput
        reference={password}
        type="password"
        labelText="password"
      />
      <FormInput
        type="password"
        reference={confirmPassword}
        labelText="confirm password"
      />
      <div className="buttons">
        <button
          onClick={() => setMode("login")}
          className="btn btn-bold-muted">
          BACK
        </button>
        <button
          onClick={handleCreate}
          className="btn btn-bold-red">
          CREATE ACCOUNT
        </button>
      </div>
    </React.Fragment>
  )
}

export default function Login({ dismiss }) {
  const [hovering, hoverRef] = useHover()
  const [mode, setMode] = React.useState("login")

  const handleBgClick = () => {
    if (hovering === true) {
      return
    } else {
      dismiss()
    }
  }

  return (
    <div className="modal-bg" onClick={handleBgClick}>
      <div
        className="modal-window login"
        ref={hoverRef} >
        {mode === "login" && <LoginContent setMode={setMode} dismiss={dismiss}/>}
        {mode === "create" && <CreateContent setMode={setMode} dismiss={dismiss} />}
      </div>
    </div>
  )
}
