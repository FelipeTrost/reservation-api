const express = require('express');
const { route } = require('../app');
const auth_middleware = require('./auth_middleware');

const router = express.Router();
router.use(auth_middleware);

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

module.exports = router;
