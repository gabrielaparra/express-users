// Configuring Passport in a separate file to avoid making
// a mess in app.js

const passport = require('passport');
const bcrypt = require('bcrypt');
//bcrypt will take care of the decrypting of the saved PW
const UserModel = require('../models/user-model.js');
//to be able to check if the user who's trying to log in exists

//serializeUser (controls what goes inside the bowl (session))


//diserializeUser (controls what you get when you check the bowl)

//---------------STRATEGIES------------------------------
//Strategies: different ways of signing in

const LocalStrategy = require('passport-local').Strategy;
//Setup passport-local

passport.use(new LocalStrategy(
  {               //1st arg -> settings object
    usernameField: 'loginUsername',
    passwordField: 'loginPassword'
  },
  (formUsername, formPassword, next) => {
    //2nd arg -> callback, called when a user tries to log in
    //#1 is there an account with the provided username?
    User.Model.findOne(
      { username: formUsername },
      (err, userFromDb) => {
        if (err) {
          next(err);
          return;
        }
        if (userFromDb === null) {
          //In passport, if you call next() with 'false'
          //it means LOGIN FAILED
          next(null, false);
          return;
        }
      }
    );
    //#2 If there's a username match, is the password correct?
    if (bcrypt.compareSync(formPassword, userFromDb.encryptedPassword) === false) {
      //how we saved the encrypted password (from the model) ^^^^
      next(null, false);
      return;
      //makes LOGIN FAIL
    }
    //If the username and password are a match with the database:
    next(null, userFromDb);
    //In passport if we call next() with a user as the 2nd arg
    //it means LOGIN SUCCESS
  }
));

//-------------------------------------------------------
