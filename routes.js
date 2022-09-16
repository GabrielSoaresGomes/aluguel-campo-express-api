const express = require('express')
const db = require("./queries");

const apiRouter = express.Router()

function availableRoutes() {
    return apiRouter.stack
        .filter(r => r.route)
        .map(r => {
            return {
                method: Object.keys(r.route.methods)[0].toUpperCase(),
                path: r.route.path
            };
        });
}

//Routes
//  get
apiRouter.get('/users', db.getUsers)
apiRouter.get('/users/:id', db.getUserById)
apiRouter.get('/fields', db.getFields)
apiRouter.get('/fields/:id', db.getFieldById)
apiRouter.get('/logout', db.logoutUser)
apiRouter.get('/', (request,  response) => {
    response.json({routes: availableRoutes()})
})

//  post
apiRouter.post('/users', db.createUser)
apiRouter.post('/login',db.loginUser)
apiRouter.post('/fields', db.createField)

//  put
apiRouter.put('/users/:id', db.updateUser)
apiRouter.put('/field/:id/lease', db.leaseField)

//  delete
apiRouter.delete('/users/:id', db.deleteUser)

module.exports = apiRouter