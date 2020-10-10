const express = require('express');
const booking = require('./booking');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/booking', booking);

module.exports = router;
