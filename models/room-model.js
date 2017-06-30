const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    photoUrl: { type: String },
    hasGhosts: { type: Boolean, default: false },
    //the ID of the user who owns the room
    owner: [ Schema.Types.ObjectId ]
  },
  {
    timestamps: true
  }
);

const RoomModel = mongoose.model('Room', roomSchema);
module.exports = RoomModel;
