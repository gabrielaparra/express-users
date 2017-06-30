const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema (
  {
    fullName: { type: String },
    // SIGN UP/ LOG IN form users
    username: { type: String },
    encryptedPassword: { type: String},
    // GOOGLE users
    googleId: { type: String },
    // FACEBOOK users
    facebookId: { type: String }
  },
  { //2nd arg OPTIONAL -> additional settings
    timestamps: true
    //timestamps creates two additional fields:
    //"createdAt" & "updatedAt"
  }
);

const UserModel = mongoose.model('User', userSchema);

//User is the model
//users is the collection, generated automaticall by Mongoose,
//based on the model's name.

module.exports = UserModel;
