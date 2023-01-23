const _ = require('lodash');

const dummy = (blogs) => {
    return 1
  }
  
  module.exports = {
    dummy
  }

const totalLikes =(blogs) => {
    const total = (sum, blogs) => {
        return sum + blogs.likes
    }
    return blogs.reduce(total, 0)
}



const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }
    const sortedBlogs = blogs.sort(function(a, b){return b.likes - a.likes})
    return sortedBlogs[0]
}


const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }
    const authors = Object.entries(_.countBy(blogs, "author"))
    authors.sort((a, b) => b[1] - a[1])
    const winner = {
        author: authors[0][0],
        blogs: authors[0][1]
      }
    return winner

}       

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }
    const grouped = _.groupBy(blogs, 'author')
    const totalLikes = _.map(grouped, (x, author) =>{
        y = [
            author,  _.sumBy(x, "likes")
        ]
        return y
    })

    totalLikes.sort((a, b) => b[1] - a[1])
    
    const winner = {
        author: totalLikes[0][0],
        likes: totalLikes[0][1]
    }
    return winner
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }