import * as React from "react"
import { createRef, Fragment, useEffect, useState } from "react"
import { FaAngleDown, FaTrash } from "react-icons/fa"
import { isOfType } from "../../utils/formatters"

import { removeUserFromAdmins, getAdmins, getUsersByIds, searchForUserByEmail, 
         addUserToAdmins, BluffsUser, DatabaseUser } from "../../utils/users"

interface ManageAdminsProps {
  user: BluffsUser
}

export default function ManageAdmins({ user }: ManageAdminsProps) {
  const [admins, setAdmins] = useState<string[] | null>()
  const [adminUserObjects, setAdminUserObjects] = useState<DatabaseUser[] | null>()
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | DatabaseUser | null>(null)
  const newAdmin = createRef<HTMLInputElement>()

  useEffect(() => {
    updateAdmins()
  })

  const updateAdmins = async () => {
    try {
      const adminsResult = await getAdmins()
      if (adminsResult.data) { 
        let adminArr = []
        for (const id in adminsResult.data) { adminArr.push(id) }  
        setAdmins(adminArr)
      }

      if (!admins) { throw Error("Error getting current admins.") }
      const usersResult = await getUsersByIds(admins)
      setAdminUserObjects(usersResult.data)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleAdd = async () => {
    try {
      if (isOfType<DatabaseUser>(result, "uid")) {
        if (!result.uid) { return }
        await addUserToAdmins(result.uid)
        setResult("Success! The user was added to the list of admins.")
      } else { throw Error("Error getting result from search") }
    } catch (e) {
      setError(e.message)
    }
  }

  const handleSearch = async () => {
    try {
      if (!newAdmin.current) { throw Error("No value for a new admin")}
      const userResult = await searchForUserByEmail(newAdmin.current.value)
      setResult(userResult.data as DatabaseUser)
    } catch (e) {
      setError(e.message)
    }
  }

  if (error) {
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
          {admins.map((admin, index) => (
            <li key={admin}>
              <AdminRow
                name={adminUserObjects[index].displayName}
                email={adminUserObjects[index].email}
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
            <Fragment>
              {isOfType<DatabaseUser>(result, "uid") && (
                <p>{`We were able to find ${result.displayName}. Add?`}</p>
              )}
              {typeof result === "string" && result[0] != "S" && (
                <Fragment>
                  <button className="btn btn-bold-muted" onClick={() => setResult(null)}>CANCEL</button>
                  <button className="btn btn-bold-red" onClick={handleAdd}>ADD USER TO ADMINS</button>
                </Fragment>
              )}
            </Fragment>
          </div>
        )}
      </div>
    </div>
  )
}

interface AdminRowProps {
  name: string
  email: string
  id: string
  user: DatabaseUser
}

function AdminRow({ name, email, id, user }: AdminRowProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleDelete = async () => {
    try {
      if (confirmDelete) {
        await removeUserFromAdmins(id)
        setResult(`${user.displayName} is no longer an admin.`)
      } else { setConfirmDelete(true) }
    } catch (e) {
      setResult(e.message)
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
