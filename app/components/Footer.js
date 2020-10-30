import React from "react"
import { NavLink } from "react-router-dom"

export default function Footer() {
  return (
    <div id="footer">
      <ul>
        <NavLink
          to="/swim" >
          Swim
        </NavLink>
        <NavLink
          to="/tennis" >
          Tennis
        </NavLink>
        <NavLink
          to="/about" >
          About
        </NavLink>
        <NavLink
          to="/contact" >
          Contact
        </NavLink>
      </ul>
      <p>©Bedford Bluffs</p>
    </div>
  )
}
