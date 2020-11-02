import * as React from "react"
import { createRef, useEffect, useState, Fragment, RefObject, CSSProperties } from "react"
import { addNewPost } from "../../utils/blog"
import { addPostToUserObject, BluffsUser } from "../../utils/users"
import { FormInput } from "../Login"

interface CreatePostProps {
  user: BluffsUser
}

export default function CreatePost({ user }: CreatePostProps) {
  const title = createRef<HTMLInputElement>()
  const content = createRef<HTMLTextAreaElement>()
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async () => {
    try {
      if (title.current && content.current) {
        const timestamp = new Date(Date.now())
        const docRef = await addNewPost(user.uid, user.displayName, timestamp, title.current.value, content.current.value)
        await addPostToUserObject(user, docRef.data.id)
        setResult(docRef.message)
      } else { throw Error("No value for title and/or content.") } 
    } catch (e) {
      setResult(e.message)
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

interface PostEditorProps {
  titleReference: RefObject<HTMLInputElement>
  contentReference: RefObject<HTMLTextAreaElement>
  handleSubmit: VoidFunction
  titleDefault?: string | null
  contentDefault?: string | null
}

export function PostEditor({ titleReference, 
                             contentReference, 
                             handleSubmit, 
                             titleDefault =  null, 
                             contentDefault = null }: PostEditorProps) {
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

  useEffect(() => {
    if (titleDefault && titleReference.current) {
      titleReference.current.value = titleDefault
    }
    if (contentDefault && contentReference.current) {
      contentReference.current.value = contentDefault
    }
  }, [])

  return (
    <Fragment>
      <FormInput
        labelText="Title"
        reference={titleReference}
      />
      <div style={styles.contentInput as CSSProperties}>
        <label style={styles.contentLabel} htmlFor="content">Content</label>
        <textarea
          style={styles.content as CSSProperties}
          ref={contentReference}
          id="content">
        </textarea>
      </div>
      <div style={styles.submit as CSSProperties}>
        <button className="btn btn-bold-red" onClick={handleSubmit}>
          SUBMIT
        </button>
      </div>
    </Fragment>
  )
}
