import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message }) => {
  const success = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }
  if (message === null) {
    return
  }
  return (
    <div style={success}>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  const error = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }
  if (message === null) {
    return null
  }

  return (
    <div style={error} className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)


  const noteFormRef = useRef()
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    return setUser(null)
  }
  const handleLikeChange = async (id, newLike) => {
    try {
      await blogService.update(id, newLike)
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs.sort((a, b) => b.likes - a.likes))
    }
    catch (err) {
      console.log(err)
    }
  }
  const handleNewBlog = async (newBlog) => {
    noteFormRef.current.toggleVisibility()
    try {
      const createdBlog = await blogService.create(newBlog)

      setBlogs(await blogService.getAll())
      setSuccessMessage(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
    catch (exception) {
      setErrorMessage(
        'Blog could not be created'
      )
    }
  }
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage('Sucessfully Logged In')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Wrong Username or Password')

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return (

    <div>
      {user === null ? <LoginForm Error={Error} errorMessage={errorMessage} handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} /> :
        <div>
          <h2>blogs</h2>
          <Notification message={successMessage} />
          <p>{user.name} logged in</p>
          <button onClick={handleLogout} id="logout">Logout</button>
          <h2>create new</h2>
          <Togglable buttonLabel="new blog" ref={noteFormRef}>
            <BlogForm createBlog={handleNewBlog} />
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} setBlogs={setBlogs} blogs={blogs} user={user} handleLikeChange={handleLikeChange} />
          )}
        </div>
      }
    </div>

  )
}

export default App
