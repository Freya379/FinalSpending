var express = require('express');
var router = express.Router();
// Import the User Model
const UserModel = require('../../models/UserModel');
const md5 = require('md5');
// Registration
router.get('/reg', (req, res) => {
  // Respond with HTML content
  res.render('auth/reg');
});

// Register user
router.post('/reg', (req, res) => {
  // Perform form validation
  // Get the request body data
  UserModel.create({...req.body, password: md5(req.body.password)}, (err, data) => {
    if(err){
      res.status(500).send('Registration failed, please try again later~~');
      return
    }
    res.render('success', {msg: 'Registration successful', url: '/login'});
  })
  
});


// Login page
router.get('/login', (req, res) => {
  // Respond with HTML content
  res.render('auth/login');
});

// Login operation
router.post('/login', (req, res) => {
  // Get username and password
  let {username, password} = req.body;
  // Query the database
  UserModel.findOne({username: username, password: md5(password)}, (err, data) => {
    // judgment
    if(err){
      res.status(500).send('Login, please try again later~~');
      return
    }
    // judge data
    if(!data){
      return res.send('Incorrect username or password~~');
    }
    // Write into session
    req.session.username = data.username;
    req.session._id = data._id;

    // Successful login response
    res.render('success', {msg: 'Login successful', url: '/account'});
  })

});

// Log out
router.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy(() => {
    res.render('success', {msg: 'Logged out successfully', url: '/login'});
  })
});

module.exports = router;
