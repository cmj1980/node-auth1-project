// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router()
const User = require('../users/users-model')
const {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree
} = require('./auth-middleware')
const bcyrpt = require('bcryptjs')


router.post('/register', checkPasswordLength, checkUsernameFree, (req, res, next) => {
  const {
    username,
    password
  } = req.body
  const hash = bcyrpt.hashSync(password, 8)

  User.add({
      username,
      password: hash
    })
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(next)

})

router.post('/login', checkUsernameExists, (req, res, next) => {
  const {
    password
  } = req.body
  if (bcyrpt.compareSync(password, req.user.password)) {
    req.session.user = req.user
    res.json({
      message: ` Welcome ${req.user.username}`
    })
  } else {
    next({
      status: 401,
      message: 'Invalid credentials'
    })
  }
})


router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        next(err)
      } else {
        res.json({
          message: 'Logged out'
        })
      }
    })
  } else {
    res.json({
      message: 'no session'
    })
  }

})


// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router