const { Category } = require('../models/category.model');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/index')

/**
 * GET/
 * retrieve and display all data from model
 */
exports.index = async (req, res) => {
   category = await Category.find({})
   .then(data => sendSuccessResponse({res, data : data}) )
   .catch(err => sendErrorResponse({res, status : 400, msg : err.message}))
}

/**
 * GET/
 * retrieve and display instance data from model
 */
exports.show = async (req, res) => {
   category = await Category.findById(req.params.id)
   .then(data => sendSuccessResponse({res, data : data}) )
   .catch(err => sendErrorResponse({res, status : 400, msg : err.message}))
}


/**
 * POST/
 * Add a new instance to database
 */
exports.store = async (req, res) => {
   const request = req.body;
   
   const categoryData = {
      title: request.title
   }
   const newCategory = new Category(categoryData);
   newCategory
      .save()
      .then(data => { sendSuccessResponse({res, msg : "Data saved"} ) })
      .catch(err => { sendErrorResponse({res, status : 400 , msg : err.message}) });
}

/**
 * PUT/
 * Update instace by id
 */
exports.update = async (req, res) => {
   const request = req.body;
   
   const categoryData = {
      title: request.title
   }

   category = await Category.findByIdAndUpdate(req.params.id, categoryData)
   .then(
      data => { sendSuccessResponse({res, msg : "Data saved" }) }
   )
   .catch(err => sendErrorResponse({res, status : 400, msg : err.message}))
}

/**
 * Delete/
 * delete instance data from model
 */
exports.destroy = async (req, res) => {
   category = await Category.findByIdAndDelete(req.params.id)
   .then(data => sendSuccessResponse({res, msg : "Data deleted"}) )
   .catch(err => sendErrorResponse({res, status : 400, msg : err.message}))
}
