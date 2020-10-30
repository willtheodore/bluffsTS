import React from "react"
import { getPostsByDate, formatPosts } from "../../utils/blog"

import Selector from "../Selector"
import BlogPost from "../BlogPost"

export default function Archive() {
  const [month, setMonth] = React.useState(null)
  const [year, setYear] = React.useState(null)
  const [posts, setPosts] = React.useState(null)
  const [error, setError] = React.useState(null)
  const years = getYears()

  React.useEffect(() => {
    if (month && year) {
      getPostsByDate(month, year)
      .then(data => {
        setPosts(posts => ({
          [`${month}/${year}`]: formatPosts(data),
          ...posts,
        }))
      })
      .catch(err => setError(err))
    }
  }, [month, year])

  return (
    <div id="archive">
      <Selector
        title="Month"
        items={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
        setState={setMonth}
        preSelected={getMonth()}
      />
      <Selector
        title="Year"
        items={years}
        setState={setYear}
      />
      {posts != null && posts.[`${month}/${year}`] != null && (
        <ul>
          {posts.[`${month}/${year}`].map(post => (
            <li key={post.postId} >
              <BlogPost
                title={post.title}
                authorName={post.authorName}
                date={post.formattedDate}
                content={post.content}
                charLimit={500}
                postId={post.postId} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function getYears() {
  const current = new Date(Date.now())
  const year = current.getYear()
  let years = new Array()
  years.push(year - 100 + 2000)
  for (let i = 1; i < 5; i ++) {
    const j = year - i  - 100 + 2000
    years.push(j)
  }
  return years
}

function getMonth() {
  const current = new Date(Date.now())
  const month = current.getMonth()
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months[month]
}
