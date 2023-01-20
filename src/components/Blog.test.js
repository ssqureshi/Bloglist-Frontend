import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('Blog tests', () => {
  const loggedUser = {

    username: 'qwerty',
    name: 'Saad',
    blogs: [],
    id: '63bb8036b5c20d4311a8f0a9'

  }

  const blog = {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    user: '63bb8036b5c20d4311a8f0a9',
    likes: 7,
    __v: 0
  }
  test('renders content', () => {
    const view = render(<Blog blog={blog} />)
    expect(view.container).toHaveTextContent('React patterns Michael Chan')
  })

  test('clicking view expands the blog', async () => {
    const view = render(<Blog blog={blog} user={loggedUser} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    expect(view.container).toHaveTextContent('https://reactpatterns.com/' && '7')
  })

  test('clicking likes twice works', async () => {
    const mockHandler = jest.fn()
    render(<Blog blog={blog} handleLikeChange={mockHandler} user={loggedUser} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.dblClick(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)


  })
})