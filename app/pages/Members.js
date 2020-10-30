import React from "react"
import AuthContext from "../contexts/auth.js"
import { useLocation } from "react-router-dom"
import { parsePath } from "../utils/formatters.js"

const RecentPosts = React.lazy(() => import("../components/memberCenter/RecentPosts.js"))
const Archive = React.lazy(() => import("../components/memberCenter/Archive.js"))
const Calendar = React.lazy(() => import("../components/memberCenter/Calendar.js"))
const SignUps = React.lazy(() => import("../components/memberCenter/SignUps.js"))
const Account = React.lazy(() => import("../components/memberCenter/Account.js"))
const Admin = React.lazy(() => import("../components/memberCenter/Admin.js"))
const PostDetail = React.lazy(() => import("../components/memberCenter/PostDetail.js"))
import Sidebar from "../components/memberCenter/Sidebar.js"
import Header from "../components/Header.js"

export default function Members() {
  const user = React.useContext(AuthContext)
  const [posts, setPosts] = React.useState(null)
  const location = useLocation()
  const pathElements = parsePath(location)

  if (user === null) {
    return (
      <div id="members-wrapper">
        <Header text="members" />
        <div className="content-wrapper">
          <h2>Please login to view this page.</h2>
        </div>
      </div>
    )
  }

  return (
    <div id="member-center">
      <h1>Member Center</h1>
      <div id="center-flow">
        <Sidebar isAdmin={user.isAdmin}/>
        <React.Suspense fallback={<div style={{
          width: "100%",
          height: "60px",
          backgroundColor: "#1E2562",
          color: "white",
          position: "absolute",
          top: "50%",
          left: "20%"
        }}></div>}>
          {(pathElements[1] === "recent" || !pathElements[1] ) && <RecentPosts />}
          {pathElements[1] === "archive" && <Archive />}
          {pathElements[1] === "calendar" && <Calendar />}
          {pathElements[1] === "signups" && <SignUps />}
          {pathElements[1] === "account" && <Account />}
          {pathElements[1] === "admin" && <Admin />}
          {pathElements[1] === "postDetail" && <PostDetail />}
        </React.Suspense>
      </div>
    </div>
  )
}
