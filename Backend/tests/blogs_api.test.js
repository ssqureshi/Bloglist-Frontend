const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')


beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const testUser = {
    username: 'root',
    name: 'root',
    password: '12345',
  }

  const savedUser = await api
      .post('/api/users')
      .send(testUser)

  const blogObjects = helper.initialBlogs.map(blog => new Blog({...blog, 'user': savedUser._id}))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

})
describe('BLOG tests', () => {
  let headers

  beforeEach(async () => {
    const testUser = {
      username: 'test',
      name: 'test',
      password: '12345',
    }

    await api
      .post('/api/users')
      .send(testUser)

    const login = await api
      .post('/api/login')
      .send(testUser)

    headers = {
      'Authorization': `bearer ${login.body.token}`
    }
  })
  test('all blogs are returned as JSON', async () => {
    const response = await api.get('/api/blogs').expect(200).set(headers)
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property is id', async () => {
    const response = await api.get('/api/blogs').expect(200).set(headers)
    const ids = response.body.map(r => r.id)
    expect(ids).toBeDefined()

  })

  test("HTTP POST creates a new blog post", async () => {
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(response.body[helper.initialBlogs.length].title).toContain("Canonical string reduction")
  })

  test("Likes default to zero", async () => {
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(response.body[helper.initialBlogs.length].likes).toEqual(0)
  })
  test("Title and Url are missing", async () => {
    const newBlog = {
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(400)

  })
})
describe('BLOG by id', () => {
  let headers

  beforeEach(async () => {
    const testUser = {
      username: 'test',
      name: 'test',
      password: '12345',
    }

    await api
      .post('/api/users')
      .send(testUser)

    const login = await api
      .post('/api/login')
      .send(testUser)

    headers = {
      'Authorization': `bearer ${login.body.token}`
    }
      const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
      }
      await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    
  })
  test("blog is deleted By id", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[helper.initialBlogs.length]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(headers)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const title = blogsAtEnd.map(x => x.title)
    expect(title).not.toContain(blogToDelete.title)
  })
  test("blog is updated by id", async () => {


    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[helper.initialBlogs.length]
    const blog = {
      likes: 10
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blog)
      .set(headers)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[helper.initialBlogs.length].likes).toBe(10)
  })

})
afterAll(() => {
  mongoose.connection.close()
})