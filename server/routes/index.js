const express = require('express');
const router = express.Router()

router.use('/categories', require('./category.router'));
router.use('/food-items', require('./food-item.router'));
router.use('/tables', require('./table.router'));

module.exports = router