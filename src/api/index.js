const express = require('express');
const booking = require('./booking');
const auth = require('./auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/booking', booking);
router.use('/auth', auth);

module.exports = router;
