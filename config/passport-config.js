// Configuring Passport in a separate file to avoid making
// a mess in app.js

const passport = require('passport');
const bcrypt = require('bcrypt');
//bcrypt will take care of the decrypting of the saved PW
const UserModel = require('../models/user-model.js');
//to be able to check if the user who's trying to log in exists

//serializeUser (controls what goes inside the bowl (session))
//(save only the user's db ID in the bowl)
//(happen only at login time)
passport.serializeUser((userFromDb, next) => {
  next(null, userFromDb._id);
});

//diserializeUser (controls what you get when you check the bowl)
//(use the ID in the bowl to retrieve the user's information)
passport.deserializeUser((idFromBowl, next) => {
  UserModel.findById(
    idFromBowl,
    (err, userFromDb) => {
      //searching with the ID in the bowl
      //might result in an error or the userFromDb
      if (err) {
        next(err);
        return;
      }
      // tell passport that we got the user's info from the DB
      next(null, userFromDb);
          //null in 1st arg means NO error
    }
  );
});

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
    UserModel.findOne(
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
    );
  }
));

//-------------------------------------------------------
