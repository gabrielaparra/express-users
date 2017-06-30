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

//---------------LOCAL STRATEGY-------------------------

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

//----------------FACEBOOK STRATEGY----------------------
const FbStrategy = require('passport-facebook').Strategy;
//Setup passport-facebook

passport.use(new FbStrategy (
  {
    //1st arg -> settings object
    clientID: '??????',
    clientSecret: '????????',
    callbackURL: '/auth/facebook/callback'
          //Our route (name this whatever you want)
  },
  (accessToken, refreshToken, profile, next) => {
    //2nd arg -> callback
    //called when a user allows us to log them in with Facebook
    console.log('Hi!');
    console.log('------FACEBOOK PROFILE INFO------');
    console.log(profile);
    console.log('');

    UserModel.findOne(
      { facebookId: profile.id},
      (err, userFromDb) => {
        if (err) {
          next(err);
          return;
        }
        //if it's the first time the user logs in with Facebook
        //userFromDb will be empty
        if (userFromDb) {
          //check if they have logged in before
          next(null, userFromDb);
          //log them in
        }
        //If it's the first time, save them in the DB
        const theUser = new UserModel ({
          fullName: profile.displayNAme,
          facebookId: profile.id
        });

        theUser.save((err) => {
          if (err) {
            next(err);
            return;
          }
          //log the user in
          next(null, theUser);
        });
      }
    );
    //Receiving the user info and saving it

    //UNLESS we have already saved their info
    //in that case we log them in
  }
));
//-------------------------------------------------------

//-------------------GOOGLE STRATEGY---------------------
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy (
  {
    //1st arg -> settings object
    clientID: '???????????',
    clientSecret: '??????????',
    callbackURL: '/auth/google/callback'
          //Our route (name this whatever you want)
  },
  (accessToken, refreshToken, profile, next) => {
    //2nd arg -> callback
    //called when a user allows us to log them in with Facebook
    console.log('Hi!');
    console.log('------GOOGLE PROFILE INFO------');
    console.log(profile);
    console.log('');

    UserModel.findOne(
      { googleId: profile.id},
      (err, userFromDb) => {
        if (err) {
          next(err);
          return;
        }
        //if it's the first time the user logs in with Google
        //userFromDb will be empty
        if (userFromDb) {
          //check if they have logged in before
          next(null, userFromDb);
          //log them in
        }
        //If it's the first time, save them in the DB
        const theUser = new UserModel ({
          fullName: profile.displayNAme,
          googleId: profile.id
        });

        //if the user doesn't have his google+ profile setup with
        //his name, then we use his email account
        if (theUser.fullName === undefined) {
          theUser.fullName = profile.emails[0].value;
        }

        theUser.save((err) => {
          if (err) {
            next(err);
            return;
          }
          //log the user in
          next(null, theUser);
        });
      }
    );
    //Receiving the user info and saving it

    //UNLESS we have already saved their info
    //in that case we log them in
  }
));
//-------------------------------------------------------
