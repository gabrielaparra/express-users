const express = require('express');
const RoomModel = require('../models/room-model.js');
const router = express.Router();

//1st step to ADD a new room
router.get('/rooms/new', (req, res, next) => {
  if (req.user) {
    res.render('room-views/new-room-view.ejs');
  }
  //OR
  // if (req.user) {
  //   res.redirect('/login');
  //   return;
  // }
});

//2nd step to ADD a new room
router.post('/rooms', (req, res, next) => {
  const theRoom = new RoomModel ({
    name: req.body.roomName,
    description: req.body.roomDescription,
    photoUrl: req.body.roomUrl,
    //Set the owner as the logged in user's database id
    owner: req.user._id
  });

  //the room is created with a 'hasGhosts' default value of
  //'false', this is to randomly change that value
  const coinFlip = Math.floor(Math.random() * 2);
  if (coinFlip === 1) {
    theRoom.hasGhosts = true;
  }

  theRoom.save((err) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/my-rooms');
  });
});

router.get('/my-rooms', (req, res, next) => {
  RoomModel.find(
    { owner: req.user._id },
    //find the rooms owned by the logged in user
    (err, roomResults) => {
      if (err) {
        next(err);
        return;
      }
      res.locals.roomsAndStuff = roomResults;
      res.render('room-views/room-list-view.ejs');
    }
  );
});

module.exports = router;
