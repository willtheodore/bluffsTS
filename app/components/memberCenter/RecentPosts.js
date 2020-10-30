import React from "react"
import { getRecentPosts, formatPosts } from "../../utils/blog"

import BlogPost from "../BlogPost"

export default function RecentPosts() {
  const [posts, setPosts] = React.useState(null)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    getRecentPosts(3)
    .then(posts => setPosts(formatPosts(posts)))
    .catch(err => setError(err))
  }, [])

  return (
    <div id="recent-posts">
      {posts != null && (
        <ul>
          {posts.map(post => (
            <li key={post.datePosted}>
              <BlogPost
                title={post.title}
                authorName={post.authorName}
                date={post.formattedDate}
                content={post.content}
                postId={post.postId}
              />
            </li>
          ))}
        </ul>
      )}
      {error != null && (
        <h2>{error}</h2>
      )}
    </div>
  )
}
