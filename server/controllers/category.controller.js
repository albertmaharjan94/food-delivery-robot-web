const { Category } = require('../models/category.model');
const {sendSuccessResponse, sendErrorResponse} = require('../helpers/index')

/**
 * GET/
 * retrieve and display all data from model
 */
exports.index = (req, res) => {
   Category.find({})
   .then(data => sendSuccessResponse(res, data = data) )
   .catch(err => sendErrorResponse(res, status = 400, msg = err))
}

/**
 * GET/
 * retrieve and display instance data from model
 */
exports.show = (req, res) => {
   Category.findById(req.params.id)
   .then(data => sendSuccessResponse(res, data = data) )
   .catch(err => sendErrorResponse(res, status = 400, msg = err))
}


/**
 * POST/
 * Add a new instance to database
 */
exports.store = (req, res) => {
   const request = req.body;
   
   const categoryData = {
      title: request.title
   }
   console.log(categoryData)
   const newCategory = new Category(categoryData);
   newCategory
      .save()
      .then(data => { sendSuccessResponse(res, msg = "Data saved" ) })
      .catch(err => { sendErrorResponse(res, status = 400, msg = err) });
}

/**
 * PUT/
 * Update instace by id
 */
exports.update = (req, res) => {
   const request = req.body;
   
   const categoryData = {
      title: request.title
   }

   Category.findByIdAndUpdate(req.params.id, categoryData)
   .then(
      data => { sendSuccessResponse(res, msg = "Data saved" ) }
   )
   .catch(err => sendErrorResponse(res, status = 400, msg = err))
}

/**
 * Delete/
 * delete instance data from model
 */
exports.destroy = (req, res) => {
   Category.findByIdAndDelete(req.params.id)
   .then(data => sendSuccessResponse(res, msg = "Data deleted") )
   .catch(err => sendErrorResponse(res, status = 400, msg = err))
}
