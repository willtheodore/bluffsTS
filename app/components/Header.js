import React from "react"
import PropTypes from "prop-types"
import AboutHeader from "../vectors/AboutHeader"
import ContactHeader from "../vectors/ContactHeader"
import MembersHeader from "../vectors/MembersHeader"

export default function Header({ text }) {
  return (
    <div className="header-comp">
      {text === "about" && <AboutHeader />}
      {text === "contact" && <ContactHeader />}
      {text === "members" && <MembersHeader />}
      <div>
        <h1>{text.toUpperCase()}</h1>
      </div>
    </div>
  )
}

Header.propTypes = {
  text: PropTypes.string.isRequired,
}
