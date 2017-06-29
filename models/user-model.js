const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema (
  {
    fullName: { type: String },
    username: { type: String },
    encryptedPassword: { type: String}
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
