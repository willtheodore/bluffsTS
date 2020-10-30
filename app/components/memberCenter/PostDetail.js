import React from "react"
import { useLocation } from "react-router-dom"
import { setPostListenerById, formatPosts } from "../../utils/blog.js"
import { parseSearch } from "../../utils/formatters.js"

import BlogPost from "../BlogPost.js"
import Comments from "../Comments.js"

export default function PostDetail() {
  const [post, setPost] = React.useState(null)
  const [error, setError] = React.useState(null)
  const unsubscribe = React.useRef(null)
  const search = parseSearch(useLocation())

  React.useEffect(() => {
    if (search.postId) {
      const unsub = setPostListenerById(search.postId, post => {
        setPost(formatPosts([post])[0])
        unsubscribe.current = unsub
      })
    }
    return () => unsubscribe.current()
  }, [])

  return (
    <div id="post-detail" >
      {error != null && <div className="content-wrapper error">{error}</div>}
      {post != null && (
        <React.Fragment>
          <BlogPost
              title={post.title}
              authorName={post.authorName}
              date={post.formattedDate}
              content={post.content}
          />
          <Comments
            comments={post.comments}
            postId={search.postId}
          />
          </React.Fragment>
      )}
    </div>
  )
}
