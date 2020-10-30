import React from "react"
import { addNewPost } from "../../utils/blog"
import { addPostToUserObject } from "../../utils/users"
import { FormInput } from "../Login"


export default function CreatePost({ user }) {
  const title = React.useRef(null)
  const content = React.useRef(null)
  const [result, setResult] = React.useState(null)

  const handleSubmit = () => {
    if (user != null && title != null && content != null) {
      const uid = user.uid
      const displayName = user.displayName
      const timestamp = new Date(Date.now())

      addNewPost(uid, displayName, timestamp, title.current.value, content.current.value)
      .then(docRef => addPostToUserObject(user, docRef.id))
      .then(() => setResult("success"))
      .catch(err => setResult(err))
    }
  }

  return (
    <div className="content-wrapper" id="create-post">
      {result === null ? (
        <PostEditor
          titleReference={title}
          contentReference={content}
          handleSubmit={handleSubmit}
        />
      ) : (
        result === "success" ? <p>Success!</p> : <p className="error">{result}</p>
      )}
    </div>
  )
}

export function PostEditor({ titleReference, contentReference, handleSubmit, titleDefault =  null, contentDefault = null }) {
  const styles = {
    contentInput: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    contentLabel: {
      fontFamily: "heebo-bold",
      fontSize: "18px",
      margin: "5px 10px 5px 0",
    },
    content: {
      margin: "5px 0",
      padding: "10px",
      backgroundColor: "#FFF0F2",
      width: "100%",
      height: "500px",
      fontFamily: "heebo-light",
      fontSize: "14px",
      resize: "vertical",
      border: "none",
    },
    submit: {
      display: "flex",
      flexDirection: "row-reverse",
    }
  }

  React.useEffect(() => {
    if (titleDefault) {
      titleReference.current.value = titleDefault
    }
    if (contentDefault) {
      contentReference.current.value = contentDefault
    }
  }, [])

  return (
    <React.Fragment>
      <FormInput
        labelText="Title"
        reference={titleReference}
      />
      <div style={styles.contentInput}>
        <label style={styles.contentLabel} htmlFor="content">Content</label>
        <textarea
          style={styles.content}
          ref={contentReference}
          id="content">
        </textarea>
      </div>
      <div style={styles.submit}>
        <button className="btn btn-bold-red" onClick={handleSubmit}>
          SUBMIT
        </button>
      </div>
    </React.Fragment>
  )
}
