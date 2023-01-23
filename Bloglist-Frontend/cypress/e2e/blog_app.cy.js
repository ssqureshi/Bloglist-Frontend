
describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'XYZ',
            username: 'xyz',
            password: '12345'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function () {
        cy.contains('Log in to application')
        cy.contains('login')
        cy.contains('username')
        cy.contains('password')
    })

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('#username').type('xyz')
            cy.get('#password').type('12345')
            cy.get('#login-button').click()
            cy.contains('Sucessfully Logged In')
            cy.contains('blogs')
        })

        it('fails with wrong credentials', function () {
            cy.get('#username').type('XYZ')
            cy.get('#password').type('12345')
            cy.get('#login-button').click()
            cy.contains('login')
            cy.get('.error').contains('Wrong Username or Password')
            cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', function () {
        beforeEach(function () {
            cy.login({ username: 'xyz', password: '12345' })
        })

        it('A blog can be created', function () {
            cy.get('#new-blog').click()
            cy.get('#title').type('Learning React')
            cy.get('#author').type('Michael')
            cy.get('#url').type('www.example.com')
            cy.get('#create').click()
            cy.contains('Learning React Michael')
            cy.contains('view')

        })

    })
    describe('When blog is already created', function () {
        beforeEach(function () {
            cy.login({ username: 'xyz', password: '12345' })
            cy.get('#new-blog').click()
            cy.get('#title').type('Learning React')
            cy.get('#author').type('Michael')
            cy.get('#url').type('www.example.com')
            cy.get('#create').click()
            cy.get('#view').click()
        })

        it('A blog has 2 likes after like button is pressed twice ', function () {

            cy.get('#like').click()
            cy.contains('1')
            cy.get('#like').click()
            cy.contains('2')
        })
        it('A blog can be removed by the user who created it ', function () {
            cy.contains('remove')
            cy.get('#remove').click()
            cy.get('html').should('not.contain', 'Learning React Micahel')
        })
        it('A blog can not be removed by the user who did not create it ', function () {
            const user = {
                name: 'Foo',
                username: 'foo',
                password: '12345'
            }
            cy.request('POST', 'http://localhost:3003/api/users/', user)
            cy.get('#logout').click()
            cy.login({ username: 'foo', password: '12345' })
            cy.get('#view').click()
            cy.get('#details').should('not.contain', 'remove')
        })
    })
    describe('sorted according to likes', function () {
        beforeEach(function () {
            cy.login({ username: 'xyz', password: '12345' })
            cy.createBlog({
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 5
            })
            cy.createBlog({
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 7
            })
            cy.createBlog({
                title: "Learning React",
                author: "Edsger W. Dijkstra",
                url: "www.example.com",
                likes: 10
            })
        })
        
        it('Sorted according to likes', function () {
            cy.get('#view').click()
            cy.get('.blog').eq(0).should('contain', 'Learning React')
            cy.get('#view').click()
            cy.get('.blog').eq(1).should('contain', 'Go To Statement Considered Harmful')
            cy.get('#view').click()
            cy.get('.blog').eq(2).should('contain', 'React patterns')
            cy.contains('React patterns').parent().find('#like').click()
            cy.contains('React patterns').parent().contains('6')
            cy.contains('React patterns').parent().find('#like').click()
            cy.contains('React patterns').parent().contains('7')
            cy.contains('React patterns').parent().find('#like').click()
            cy.contains('React patterns').parent().contains('8')
            cy.get('.blog').eq(1).should('contain', 'React patterns')
            cy.contains('React patterns').parent().find('#like').click()
            cy.contains('React patterns').parent().contains('9')
            cy.contains('React patterns').parent().find('#like').click()
            cy.contains('React patterns').parent().contains('10')
            cy.contains('React patterns').parent().find('#like').click()
            cy.contains('React patterns').parent().contains('11')
            cy.get('.blog').eq(0).should('contain', 'React patterns')
        })
    })
})