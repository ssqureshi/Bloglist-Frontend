import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, blogs, user }) => {
  const [visible, setVisible] = useState(false)

  const handleVisibility = async () => {
    setVisible(!visible)
  }
  const handleLike = async () => {
    try {
      const id = blog.id
      await blogService.update(id, {
        'title': blog.title,
        'author': blog.author,
        'url': blog.url,
        'likes': blog.likes + 1
      })
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs.sort((a, b) => b.likes - a.likes))
    }
    catch (err) {
      console.log(err)
    }
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
      <div style={blogStyle} >
        {blog.title} <button onClick={handleVisibility}>hide</button>
        <br />
        {blog.url}
        <br />
        {blog.likes} <button onClick={handleLike}>like</button>
        <br />
        {blog.author}
        <br />
        {blog.user.id === user.id && <button onClick={handleRemove}>remove</button>}
      </div>
    )
  }

  return (
    <>
      {!visible ?
        <div style={blogStyle} >
          {blog.title} {blog.author} <button onClick={handleVisibility}>view</button>
        </div>
        :
        <Details />
      }
    </>
  )
}

export default Blog
