const express = require('express');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user-model.js');
const router = express.Router();

router.get('/signup', (req, res, next) => {
  res.render('authorization-views/signup-view.ejs');
});

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
});

module.exports = router;
