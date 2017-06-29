const express = require('express');
const router = express.Router();

router.get('/signup', (req, res, next) => {
  res.render('authorization-views/signup-view.ejs');
});

module.exports = router;
