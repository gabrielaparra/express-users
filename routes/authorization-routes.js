const express = require('express');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user-model.js');
const passport = require('passport');
const router = express.Router();

//--------------------REGISTRATION--------------------------
//STEP 1 of signup: displaying the signup form
router.get('/signup', (req, res, next) => {
  res.render('authorization-views/signup-view.ejs');
});

//STEP 2 of signup: processing the information submitted in the signup form
router.post('/signup', (req, res, next) => {
  if (req.body.signupUsername === '' || req.body.signupPassword === '') {
    res.locals.messageForDumbUsers = 'Please provide both username and password.';
    res.render('authorization-views/signup-view.ejs');
    return;
  }

  //Checking if the username already exists in the database
  UserModel.findOne(
    { username: req.body.signupUsername },
    (err, userFromDb) => {
      //if there's an error retrieving the information from the DB
      if (err){
        next(err);
        return;
      }

      //if a match was found (the username is taken)
      if (userFromDb) {
        res.locals.messageForDumbUsers = 'Sorry, that username is taken.';
        //display the form again with the feedback message
        res.render('authorization-views/signup-view.ejs');
        return;
      }

      //if the username is available run these lines of code:
      const salt = bcrypt.genSaltSync(10);
      const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);
      //encrypting the user's input PW before saving it

      const theUser = new UserModel({
        fullName: req.body.signupFullName,
        username: req.body.signupUsername,
        encryptedPassword: scrambledPassword
      });

      theUser.save((err) => {
        if (err) {
          next(err);
          return;
        }
        res.redirect('/');
        //redirect to homepage
      });
    }
  );
});//--------------END REGISTRATION---------------


//-------------------LOG IN------------------------
//1st step: displaying login form
router.get('/login', (req, res, next) => {
  res.render('authorization-views/login-view.ejs');
});

//2nd step: authentication
router.post('/login', passport.authenticate(
  'local',
  //1st arg -> name of the strategy used to log in
  {
    successRedirect: '/',
    failureRedirect: '/login'
    //Redirect accordingly (if login is successful or fails)
  }
  //2nd arg -> settings object
));
//------------------END LOG IN----------------------


//-------------------LOG OUT-------------------------
router.get('/logout', (req, res, next) => {
  req.logout();
  //the req.logout() function is defined by the passport middleware in app.js
  res.redirect('/');
});
//---------------------------------------------------

module.exports = router;
