import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import "./scss/index.scss"
import { AuthProvider } from "./contexts/auth.js"
import firebase from "./firebase.js"
import { determineIfAdmin, getAdmins } from "./utils/users.js"

import Nav from "./components/Nav.js"
import Footer from "./components/Footer.js"
const Home = React.lazy(() => import("./pages/Home.js"))
const Info = React.lazy(() => import("./pages/Info.js"))
const About = React.lazy(() => import("./pages/About.js"))
const Contact = React.lazy(() => import("./pages/Contact.js"))
const Members = React.lazy(() => import("./pages/Members.js"))

function App() {
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(userObj => {
      let isAdmin;
      if (userObj) {
        getAdmins()
        .then(admins => isAdmin = determineIfAdmin(userObj, admins))
        .then(() => setUser({
          isAdmin: isAdmin,
          ...userObj
        }))
        .catch(err => console.log(err))
      } else {
        setUser(null)
      }
    })
  }, [])

  return (
    <Router>
      <AuthProvider value={user}>
        <React.Suspense fallback={<div style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#1E2562",
          color: "white",
          position: "absolute",
          top: "50%",
          left: "20%"
        }}></div>}>
        <div className="container">
          <Nav />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/swim">
              <Info
                title="swim"
                alignment="left"
              />
            </Route>
            <Route exact path="/tennis">
              <Info
                title="tennis"
                alignment="right"
              />
            </Route>
            <Route exact path="/about" component={About} />
            <Route exact path="/contact" component={Contact} />
            <Route path="/members" component={Members} />
            <Route render={() => (
              <div id="fourohfour">
                <h1>Uh oh! Looks like you've reached a 404. Try again.</h1>
              </div>
            )} />
          </Switch>
          <Footer />
        </div>
        </React.Suspense>
      </AuthProvider>
    </Router>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById("app")
)
