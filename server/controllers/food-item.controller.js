const { FoodItem } = require('../models/food-item.model');
const { sendSuccessResponse, sendErrorResponse, uploadFiles } = require('../helpers/index')


/**
 * GET/
 * retrieve and display all data from model
 */
exports.index = async (req, res) => {
   foodItem = await FoodItem.find({})
   .then(data => sendSuccessResponse( {res, data:data} ) )
   .catch(err =>  sendErrorResponse({res, status : 400, msg : err.message}) )
}

/**
 * GET/
 * retrieve and display instance data from model
 */
exports.show = async (req, res) => {
   foodItem = await FoodItem.findById(req.params.id)
   .then(data => { console.log(typeof( data.image));sendSuccessResponse({ res, data : data }) })
   .catch(err => sendErrorResponse({res, status : 400, msg : err.message}))
}


/**
 * POST/
 * Add a new instance to database
 */
exports.store = async (req, res) => {
   const request = req.body;

   let foodItemData = {
      title: request.title,
      short_description: request.short_description,
      long_description: request.long_description,
   }
   var file = null;
   if(request.file !=undefined){
      var file = await uploadFiles({file : request.file, folder : "food_items", validExt : ["jpg", "jpeg", "png", "jiff"]})
      console.log(file);
      if(file.success = true){
         file = file.data
      }else{
         sendErrorResponse({ res, status : 400 , msg : file.msg} )
         return
      }
   }

   if(file != null)  foodItemData.image = file;
   const newfoodItem = new FoodItem(foodItemData);
   newfoodItem
      .save()
      .then(data => { sendSuccessResponse({ res, msg : "Data saved"} ) })
      .catch(err => { sendErrorResponse( {res, status : 400 , msg : err.message}) });
}

/**
 * PUT/
 * Update instace by id
 */
exports.update = async (req, res) => {
   const request = req.body;
   
   const foodItemData = {
      title: request.title
   }

   foodItem = await FoodItem.findByIdAndUpdate(req.params.id, foodItemData)
   .then(
      data => { sendSuccessResponse({res, msg : "Data saved"} ) }
   )
   .catch(err => sendErrorResponse({res, status : 400, msg : err.message}))
}

/**
 * Delete/
 * delete instance data from model
 */
exports.destroy = async (req, res) => {
   foodItem = await FoodItem.findByIdAndDelete(req.params.id)
   .then(data => sendSuccessResponse({res, msg : "Data deleted"}) )
   .catch(err => sendErrorResponse({res, status : 400, msg : err.message}))
}
