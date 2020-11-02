import * as React from "react"
import { CSSProperties, createRef, useState, useContext } from "react"
import { FaTrash } from "react-icons/fa"
import { isNull } from "lodash"

import { formatComment } from "../utils/formatters"
import { postComment, deleteCommentById, FSCommentCollection, FSComment } from "../utils/blog"
import AuthContext from "../contexts/auth"
import { BluffsUser } from "../utils/users"
import { SetState } from "./Selector"

interface CommentsProps {
  comments: FSCommentCollection;
  postId: string;
}
interface CommentProps {
  comment: FSComment;
  comments: FSCommentCollection;
  uid: string;
  postId: string;
  setResult: SetState<string>;
}
export interface StyleSet {
  [key: string]: CSSProperties
}

export default function Comments({ comments, postId }: CommentsProps) {
  const styles: StyleSet = {
    comments: {
      display: "flex",
      flexDirection: "column",
      margin: "0 20px",
    },
    title: {
      fontFamily: "heebo-bold",
      fontSize: "48px",
      color: "white",
    },
    wrapper: {
      display: "flex",
    },
    label: {
      fontFamily: "heebo-regular",
      fontSize: "18px",
      color: "white",
      marginRight: "10px",
      flexBasis: "200px",
    },
    inputWrapper: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      alignItems: "flex-end",
    },
    field: {
      padding: "10px",
      width: "100%",
      height: "100px",
      flexGrow: 1,
      resize: "vertical",
      border: "none",
      marginBottom: "10px",
      fontFamily: "heebo-regular",
      fontSize: "18px",
    },
  }

  const newComment = createRef<HTMLTextAreaElement>()
  const [result, setResult] = useState<string | null>(null)
  const user = useContext<BluffsUser>(AuthContext)

  const handleSubmit = () => {
    if (isNull(newComment.current) ||
        isNull(user) ) { return }
    const cVal = newComment.current.value
    const uid = user.uid
    const authorName = user.displayName
    const timestamp = new Date(Date.now())
    const commentsObj = comments != undefined ? comments : null

    postComment(postId, uid, authorName, timestamp, cVal, commentsObj)
    .then(() => {
      setResult("success")
      if (isNull(newComment.current)) { return }
      newComment.current.value = ""
    })
    .catch(err => setResult(err))
  }

  const getCommentsContent = (postComments: FSCommentCollection) => {
    let content = []
    for (const id in postComments) {
      const comment = postComments[id]
      if (comment) {
        content.push(
          <li key={id}>
            <Comment
              comment={comment}
              comments={postComments}
              uid={user.uid}
              postId={postId}
              setResult={setResult}
            />
          </li>
        )
      }
    }
    return content
  }

  return (
    <div style={styles.comments}>
      <h2 style={styles.title}>Comments</h2>
      {result === null || result === "success" ? (
        <div style={styles.wrapper}>
          <label htmlFor="addComment"  style={styles.label}>Add a comment:</label>
          <div  style={styles.inputWrapper}>
            <textarea id="addComment" ref={newComment}  style={styles.field}></textarea>
            <button className="btn btn-bold-red" onClick={handleSubmit}>SUBMIT</button>
          </div>
        </div>
      ) : (
        <div className="content-wrapper">
          <p className="error">{result}</p>
        </div>
      )}
      {comments != undefined && user && (
        <ul>
          {getCommentsContent(comments)}
        </ul>
      )}
    </div>
  )
}

function Comment({ comment, uid, postId, comments, setResult }: CommentProps) {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      margin: "10px 0",
    },
    descriptionWrapper: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
    },
    description: {
      fontFamily: "heebo-light",
      fontSize: "16px",
      flexGrow: "1",
      textAlign: "left",
    },
    break: {
      width: "100%",
      margin: 0,
      border: "none",
      borderBottom: "2px solid #3892CC",
    },
    content: {
      fontFamily: "heebo-regular",
    }
  }

  const formattedComment = formatComment(comment)
  const commentId = comment.datePosted.toDate().getTime().toString()
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

  const handleDelete = (id: string) => {
    if (postId && uid === comment.author && comments[id] != null) {
      if (confirmDelete) {
        deleteCommentById(postId, id)
        .then(success => setResult("success"))
        .catch(err => setResult(err))
      } else {
        setConfirmDelete(true)
      }
    }
  }

  return (
    <div className="content-wrapper" style={styles.container as CSSProperties}>
      <div style={styles.descriptionWrapper as CSSProperties}>
        <p style={styles.description as CSSProperties}>{`posted by ${formattedComment.authorName} on ${formattedComment.formattedDate}`}</p>
        {uid === comment.author && (
          !confirmDelete
          ? <FaTrash onClick={() => handleDelete(commentId)} className="pointer" />
          : (
            <div>
              <button className="btn btn-bold-muted" onClick={() => setConfirmDelete(false)}>BACK</button>
              <button className="btn btn-bold-red" onClick={() => handleDelete(commentId)}>CONFIRM</button>
            </div>
          )
        )}
      </div>
      <hr style={styles.break}/>
      <p style={styles.content}>{formattedComment.content}</p>
    </div>
  )
}
