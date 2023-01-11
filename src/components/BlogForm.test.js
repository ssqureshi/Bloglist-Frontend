import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('creating a new blog works', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()
  render(<BlogForm createBlog={createBlog}/>)


  const title = screen.getByPlaceholderText('Title')
  const author = screen.getByPlaceholderText('Author')
  const url = screen.getByPlaceholderText('URL')
  const button = screen.getByText('create')

  await user.type(title, 'New Blog on React')
  await user.type(author, 'XYZ')
  await user.type(url, 'example.com')
  await user.click(button)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('New Blog on React')
  expect(createBlog.mock.calls[0][0].author).toBe('XYZ')
  expect(createBlog.mock.calls[0][0].url).toBe('example.com')
})