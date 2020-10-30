import React from "react"
import { FaAngleDown, FaTrash } from "react-icons/fa"
import { removeUserFromAdmins, getAdmins, getUsersByIds, searchUserByEmail, addUserToAdmins } from "../../utils/users"

export default function ManageAdmins({ user }) {
  const [admins, setAdmins] = React.useState(null)
  const [adminUserObjects, setAdminUserObjects] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [result, setResult] = React.useState(null)
  const newAdmin = React.useRef()

  React.useEffect(() => {
    getAdmins()
    .then(admins => {
      let result = [];
      for (const id in admins) {
        result.push(id)
      }
      setAdmins(result)
    })
    .catch(err => setError(err))
  }, [])

  React.useEffect(() => {
    if (admins) {
      getUsersByIds(admins)
      .then(users => setAdminUserObjects(users))
      .catch(err => setError(err))
    }
  }, [admins])

  const handleAdd = () => {
    if (result) {
      addUserToAdmins(result.data.id)
      .then(result => setResult({ message: result }))
      .catch(err => setError(err))
    }
  }

  const handleSearch = () => {
    searchUserByEmail(newAdmin.current.value)
    .then(result => setResult(result))
    .catch(err => setResult(err))
  }

  if (error) {
    debugger;
    return (
      <div id="manage-admins">
        <div className="content-wrapper">
          <p className="error">{error}</p>
        </div>
      </div>
    )
  }

  if (!admins || !adminUserObjects) {
    return (
      <div id="manage-admins">
        <div className="content-wrapper">
          <p>One moment please.</p>
        </div>
      </div>
    )
  }

  return (
    <div id="manage-admins">
      <div className="content-wrapper">
        <span>
          <h3>Exisiting admins:</h3>
          <FaAngleDown />
        </span>
        <ul className="admin-list">
          {admins.map(admin => (
            <li key={admin}>
              <AdminRow
                name={adminUserObjects[admin].displayName}
                email={adminUserObjects[admin].email}
                id={admin}
                user={user}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="content-wrapper">
        <span>
          <h3>Add new admins:</h3>
          <FaAngleDown />
        </span>
        <p>Please enter the email of the user you wish to grant admin priveledges.</p>
        <div className="input-field">
          <input type="text" ref={newAdmin} />
          <button onClick={handleSearch} className="btn btn-bold-red">SEARCH</button>
        </div>
        {result && (
          <div className="results-field">
            {result === "fail" ? (
              <p className="error">We were unable to find a matching user with that email address. Please try again.</p>
            ) : (
              <React.Fragment>
                <p>{result.message}</p>
                {result.message[0] != "S" && (
                  <React.Fragment>
                    <button className="btn btn-bold-muted" onClick={() => setResult(null)}>CANCEL</button>
                    <button className="btn btn-bold-red" onClick={handleAdd}>ADD USER TO ADMINS</button>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminRow({ name, email, id, user }) {
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const [result, setResult] = React.useState(null)

  const handleDelete = () => {
    if (confirmDelete) {
      removeUserFromAdmins(id)
      .then(result => setResult(result))
      .catch(err => setResult(err))
    } else {
      setConfirmDelete(true)
    }
  }

  if (result) {
    return (
      <div className="admin-row">
        <p>{result}</p>
      </div>
    )
  }

  return (
    <React.Fragment>
      <p>{name}</p>
      <p>{email}</p>
      {user.uid != id && (
        !confirmDelete ? (
          <FaTrash onClick={handleDelete} className="pointer"/>
        ) : (
          <div className="buttons">
            <button className="btn btn-bold-muted" onClick={() => setConfirmDelete(false)}>BACK</button>
            <button className="btn btn-bold-red" onClick={handleDelete}>CONFIRM</button>
          </div>
        )
      )}
    </React.Fragment>
  )
}
