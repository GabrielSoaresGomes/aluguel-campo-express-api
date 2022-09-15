const {request, response} = require("express");
const Pool = require('pg').Pool

const pool = new Pool ({
    user: 'gabriel',
    host: 'localhost',
    database: 'api',
    password: '123',
    port: 5432
})

var session = require('./index').session

const getUsers = (request, response) => {
    session = request.session
    if (session.userid) {
        pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }else {
        response.status(405).send("You're not logged in! Send a post to http://localhost/login with your credentials!")
    }

}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    session = request.session
    if (session.userid) {
        pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }else {
        response.status(405).send("You're not logged in! Send a post to http://localhost/login with your credentials!")
    }
}

const createUser = (request, response) => {
    const {name, email, password} = request.body
    session = request.session
    if (session.userid) {
        pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password], (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(`User added with ID: ${results.rows[0].id}`)
        } )
    }else {
        response.status(405).send("You're not logged in! Send a post to http://localhost/login with your credentials!")
    }

}

const updateUser = (request, response) => {
    session = request.session
    const id = parseInt(request.params.id)
    const { name, email, password } = request.body

    if (session.userid) {
        pool.query('UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4', [name, email, password, id], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User of ID ${id} has been modified!`)
        })
    }else {
        response.status(405).send("You're not logged in! Send a post to http://localhost/login with your credentials!")
    }

}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
    const session = request.session
    if (session.userid) {
        pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User with id ${id} has ben deleted!`)
        })
    }else {
        response.status(405).send("You're not logged in! Send a post to http://localhost/login with your credentials!")
    }

}

const loginUser = (request, response) => {
    const userEmail = request.body.email
    const userPassword = request.body.password
    pool.query('SELECT * FROM users WHERE email = $1 and password = $2', [userEmail, userPassword], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows[0]) {
            session = request.session
            session.userid=request.body.email
            console.log(session)
            response.send('Welcome!')
        } else {
            response.send('Invalid email or password');
        }
    })
}

const logoutUser = (request, response) => {
    request.session.destroy();
    response.redirect('/');
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser
}