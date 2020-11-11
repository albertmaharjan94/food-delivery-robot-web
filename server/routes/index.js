const express = require('express');
const router = express.Router()

router.use('/categories', require('./category.router'));

module.exports = router