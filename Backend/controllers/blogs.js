const blogsRouter = require('express').Router()
const Blog = require('../models/blog')




blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  })

 blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return (
      response.status(400).json({error: 'Title and URL are required'})
    )
  }
  const user = request.user
  const blog = new Blog ({
    title: request.body.title,  
    author: request.body.author,
    url: request.body.url,
    likes: Object.hasOwn(request.body, 'likes') ? request.body.likes : 0,
    user: user._id
  })
 

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  })

  blogsRouter.delete('/:id', async (request, response) => {

    const blog = await Blog.findById(request.params.id)
    const user = request.user

    if (blog.user.toString() 
    === user.id) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
    }
    else {
      return response.status(401).json({ error: 'You do not have authorization to delete this blog' })
  }
  })

  blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
      "title": body.title,
      "author": body.author,
      "url": body.url,
      "likes": body.likes + 1
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
    response.json(updatedBlog)
  }
)
  module.exports = blogsRouter