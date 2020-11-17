const express = require('express');
const router = express.Router()

router.use('/categories', require('./category.router'));
router.use('/food-items', require('./food-item.router'));

module.exports = router