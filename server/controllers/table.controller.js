const { Table } = require('../models/table.model');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/index')

/**
 * GET/
 * retrieve and display all data from model
 */
exports.index = async (req, res) => {
   table = await Table.find({})
   .then(data => sendSuccessResponse({res, data : data}) )
   .catch(err => sendErrorResponse({res, status : 400, msg : err.message}))
}

/**
 * GET/
 * retrieve and display instance data from model
 */
exports.show = async (req, res) => {
   table = await Table.findById(req.params.id)
   .then(data => sendSuccessResponse({res, data : data}) )
   .catch(err => sendErrorResponse({res, status : 400, msg : err.message}))
}


/**
 * POST/
 * Add a new instance to database
 */
exports.store = async (req, res) => {
   const request = req.body;
   
   const tableData = {
      table_name: request.table_name
   }
   const newTable = new Table(tableData);
   newTable
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
   
   const tableData = {
      table_name: request.table_name
   }

   table = await Table.findByIdAndUpdate(req.params.id, tableData)
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
   table = await Table.findByIdAndDelete(req.params.id)
   .then(data => sendSuccessResponse({res, msg : "Data deleted"}) )
   .catch(err => sendErrorResponse({res, status : 400, msg : err.message}))
}
