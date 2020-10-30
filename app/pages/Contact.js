import React from "react"

import Header from "../components/Header"

export default function Contact() {
  const name = React.useRef("")
  const email = React.useRef("")
  const message = React.useRef("")

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
            type="text"
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
