import React from "react"
import { FaPencilAlt, FaEdit, FaLock, FaCalendar } from "react-icons/fa"
import { Route, Switch, useLocation } from "react-router-dom"
import AuthContext from "../../contexts/auth"
import Selector from "../Selector"
import { parsePath } from "../../utils/formatters"

const CreatePost = React.lazy(() => import("./CreatePost"))
const CalendarEvents = React.lazy(() => import("./CalendarEvents"))
const ManagePosts = React.lazy(() => import("./ManagePosts"))
const ManageAdmins = React.lazy(() => import("./ManageAdmins"))

export default function Admin() {
  const user = React.useContext(AuthContext)
  const path = parsePath(useLocation())
  const pathInContext = path[2]

  if (!user.isAdmin) {
    return (
      <div id="admin">
        <div className="content-wrapper">
          <p>You must be an admin to view this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div id="admin">
      <Selector
        icons={[ <FaPencilAlt />, <FaEdit />, <FaCalendar />, <FaLock />]}
        items={["Create Post", "Manage Posts", "Calendar Events", "Manage Admins"]}
        linkDestinations={["createPost", "managePosts", "calendarEvents", "manageAdmins"]}
      />
      <React.Suspense>
        {pathInContext === "createPost" && <CreatePost user={user} />}
        {pathInContext === "managePosts" && <ManagePosts />}
        {pathInContext === "calendarEvents" && <CalendarEvents />}
        {pathInContext === "manageAdmins" && <ManageAdmins user={user} />}
      </React.Suspense>
    </div>
  )
}
