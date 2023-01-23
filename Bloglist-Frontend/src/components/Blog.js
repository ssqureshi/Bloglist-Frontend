import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, blogs, user, handleLikeChange }) => {
  const [visible, setVisible] = useState(false)

  const handleVisibility = () => {
    setVisible(!visible)
  }
  const handleLike = () => {
    const id = blog.id
    handleLikeChange(id, {
      'title': blog.title,
      'author': blog.author,
      'url': blog.url,
      'likes': blog.likes
    })

  }

  const handleRemove = async () => {
    try {
      const id = blog.id
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => { return blog.id !== id }))
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const Details = () => {
    return (
      <div style={blogStyle} id="details" >
        {blog.title} <button onClick={handleVisibility}>hide</button>
        <br />
        {blog.url}
        <br />
        {blog.likes} <button onClick={handleLike} id="like">like</button>
        <br />
        {blog.author}
        <br />
        {blog.user.id === user.id && <button onClick={handleRemove} id="remove">remove</button>}
      </div>
    )
  }

  return (
    <div className='blog'>
      {!visible ?
        <div style={blogStyle} >
          {blog.title} {blog.author} <button onClick={handleVisibility} id="view">view</button>
        </div>
        :
        <Details />
      }
    </div>
  )
}

export default Blog
