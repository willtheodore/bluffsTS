import * as React from "react"

import Header from "../components/Header"

export default function Contact() {
  const name = React.createRef<HTMLInputElement>()
  const email = React.createRef<HTMLInputElement>()
  const message = React.createRef<HTMLTextAreaElement>()

  return (
    <div id="contact-wrapper">
      <Header text="contact"/>
      <div className="content-wrapper">
        <div className="name line-input">
          <label
            htmlFor="contact-name"
            className="bold-label">YOUR FULL NAME
          </label>
          <input
            type="text"
            id="contact-name"
            ref={name} />
        </div>
        <div className="email line-input">
          <label
            htmlFor="contact-name"
            className="bold-label">
            YOUR EMAIL
          </label>
          <input
            type="text"
            id="contact-name"
            ref={email} />
        </div>
        <div className="message">
          <label
            htmlFor="contact-name"
            className="bold-label">
            MESSAGE
          </label>
          <textarea
            id="contact-name"
            ref={message} />
        </div>
        <div className="button-wrapper">
          <button
            className="btn">
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  )
}