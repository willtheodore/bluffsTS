import React from "react"
import AuthContext from "../../contexts/auth"
import { FaPencilAlt, FaTrash } from "react-icons/fa"
import { getUserById, removePostFromUserObject } from "../../utils/users"
import { setPostListenerByIds, formatPosts, deletePostById, updatePostTitleAndContent } from "../../utils/blog"

import BlogPost from "../BlogPost"
import { PostEditor } from "./CreatePost"

export default function ManagePosts() {
  const user = React.useContext(AuthContext)
  const [posts, setPosts] = React.useState(null)
  const [userObj, setUserObj] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [edit, setEdit] = React.useState(null)
  const [deletePost, setDeletePost] = React.useState(null)

  React.useEffect(() => {
    if (user) {
      getUserById(user.uid)
      .then(user => setUserObj(user))
      .catch(err => setError(err))
    } else {
      setUserObj(null)
    }
  }, [user])

  React.useEffect(() => {
    if (userObj) {
      const unsubscriber = setPostListenerByIds(userObj.posts, setPosts)
      return () => {
        unsubscriber()
      }
    } else {
      setPosts(null)
    }
  }, [userObj])

  const handleDelete = (id) => {
    if (deletePost) {
      const postId = deletePost
      deletePostById(postId)
      .then(success => setDeletePost(`success: ${postId}`))
      .then(() => removePostFromUserObject(user, postId))
      .catch(err => setError(err))
    } else {
      setDeletePost(id)
    }
  }

  const getPostsContent = () => (
    <ul className="posts">
      {posts && posts.map(post => (
          <li key={post.postId}>
            <div>
              {deletePost != post.postId && deletePost != `success: ${post.postId}` ? (
                <React.Fragment>
                  <FaPencilAlt
                    className="pointer"
                    size={38}
                    onClick={() => setEdit(post)}
                  />
                  <FaTrash
                    className="pointer"
                    size={38}
                    onClick={() => handleDelete(post.postId)}
                  />
                </React.Fragment>
              ) : deletePost != `success: ${post.postId}` && (
                <React.Fragment>
                  <button className="btn btn-bold-muted" onClick={() => setDeletePost(null)}>
                    BACK
                  </button>
                  <button className="btn btn-bold-red" onClick={handleDelete}>
                    CONFIRM
                  </button>
                </React.Fragment>
              )}
            </div>
            {!deletePost || (deletePost != `success: ${post.postId}`) ? (
              <BlogPost
                title={post.title}
                authorName={post.authorName}
                date={post.formattedDate}
                content={post.content}
                charLimit={500}
                postId={post.postId}
              />
            ) : (
              <div className="content-wrapper success-message">
                <p>Success! This post was deleted.</p>
              </div>
            )}
          </li>
      ))}
    </ul>
  )

  if (error) {
    return (
      <div id="manage-posts" className="content-wrapper">
        <p className="error">{error}</p>
      </div>
    )
  }

  return (
    <div id="manage-posts">
      <div className="manage-posts-header">
        {edit != null ? (
          <React.Fragment>
            <h2>Edit Posts</h2>
            <button className="btn btn-bold-muted" onClick={() => setEdit(null)}>Back</button>
          </React.Fragment>
        ) : <h2>Your posts</h2>}
      </div>
      <hr />
      {!edit ? getPostsContent() : (
        <EditPost
          postObj={edit}
        />
      )}
    </div>
  )
}

function EditPost({ postObj }) {
  const title = React.useRef(null)
  const content = React.useRef(null)
  const [result, setResult] = React.useState(null)

  const handleSubmit = () => {
    const tVal = title.current.value
    const cVal = content.current.value

    updatePostTitleAndContent(postObj.postId, tVal, cVal)
    .then(() => setResult("success"))
    .catch(err => setResult(err))
  }

  return (
    <div id="edit-post" className="content-wrapper">
      {result != null ? (
        result === "success" ? <p>Success! Your post has been edited.</p> : <p className="error">{result}</p>
      ) : (
        <PostEditor
          titleReference={title}
          contentReference={content}
          handleSubmit={handleSubmit}
          titleDefault={postObj.title}
          contentDefault={postObj.content}
        />
      )}
    </div>
  )
}
