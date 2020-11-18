const { FoodItem } = require('../models/food-item.model');
const { sendSuccessResponse, sendErrorResponse, uploadMany, uploadOne, deleteMany, deleteOne } = require('../helpers/index')


/**
 * GET/
 * retrieve and display all data from model
 */
exports.index = async (req, res) => {
   try{
      foodItem = await FoodItem.find({}).populate('category')
      .exec(function (err, data) {
         data = data.map(function(q) {
            return {
               id: q.id,
               title: q.title,
               short_description: q.short_description,
               price: q.price,
               long_description: q.long_description,
               image_url: q.image_path,
               category_id: q.category ? q.category.id : null,
               category: q.category ? q.category.title : null,
            }
         });
         sendSuccessResponse({ res, data : data })
      });

   }catch(err){
      sendErrorResponse({res, status : 400, msg : err.message})
   }
}

/**
 * GET/
 * retrieve and display instance data from model
 */
exports.show = async (req, res) => {
   foodItem = await FoodItem.findById(req.params.id).populate('category')
   .then(data => { 
      filtered = {
         id: data.id,
         title: data.title,
         short_description: data.short_description,
         long_description: data.long_description,
         price: data.price,
         image_url: data.image_path,
         category_id: data.category ? data.category.id : null,
         category: data.category ? data.category.title : null,
      }
      sendSuccessResponse({ res, data : filtered }) 
   })
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
      category: request.category,
      price: request.price,
   }   
   const newfoodItem = new FoodItem(foodItemData);

   const validatedModel = newfoodItem.validateSync()
   if(!!validatedModel) { sendErrorResponse({ res, status : 400 , msg : validatedModel.message} ); return; }
   
   var file = null;
   
   if(request.file !=undefined){
      const folder = "food_items";
      var file = uploadMany({file : request.file, folder : folder, validExt : ["jpg", "jpeg", "png", "jiff"]})
      
      if(file.success = true){
         file = file.data
      }else{
         sendErrorResponse({ res, status : 400 , msg : file.msg} )
         return
      }
   }
   if(file != null)  newfoodItem.image = file;

   newfoodItem.save()
   sendSuccessResponse({ res, msg : "Data saved"} )
   
}

/**
 * PUT/
 * Update instace by id
 */
exports.update = async (req, res) => {
   const request = req.body;
   
   let foodItemData = {
      title: request.title,
      short_description: request.short_description,
      long_description: request.long_description,
      category: request.category,
      price: request.price,
   }

   foodItem = await FoodItem.findByIdAndUpdate(req.params.id, foodItemData)
   .then(
      data => { sendSuccessResponse({res, msg : "Data updated"} ) }
   )
   .catch(err => sendErrorResponse({res, status : 400, msg : err.message}))
}

/**
 * Delete/
 * delete instance data from model
 */
exports.destroy = async (req, res) => {
   foodItem = await FoodItem.findByIdAndDelete(req.params.id)
   .then(data =>{
      files = JSON.parse(data.image)
      console.log(files);
      deleteMany(files, 'food_items');

      sendSuccessResponse({res, msg : "Data deleted"}) 
   })
   .catch(err => sendErrorResponse({res, status : 400, msg : err.message}))
}

exports.addImage = async (req, res) =>{
   const request = req.body;
   foodItem = await FoodItem.findOne({_id: req.params.id})
   .then(async data => {

      images = data.image ? JSON.parse(data.image) : []

      const folder = "food_items"
      var  file =  await uploadOne({file : request.file, folder : folder, validExt : ["jpg", "jpeg", "png", "jiff"]})
      console.log(file);
      if(file.success = true){
         file = file.data
         images.push(file);
         data.image = images;
         data.save();
         sendSuccessResponse({res, msg : "Data saved"}) 
      }else{
         sendErrorResponse({ res, status : 400 , msg : file.msg} )
      }
   }).catch(err => sendErrorResponse({res, status : 400, msg : err.message}));
   
   
}

exports.deleteImage = async (req, res) =>{
   const request = req.body;
   foodItem = await FoodItem.findOne({_id: req.params.id})
   .then(async data => {
      
      images = data.image ? JSON.parse(data.image) : []
      
      const folder = "food_items"
      if(!images.includes(request.file)){
         sendErrorResponse({ res, status : 400 , msg : "File already deleted"} )
         return;
      }
      var  file =  await deleteOne({filename : request.file, folder: folder})
      
      if(file.success = true){
         file = file.data
         images.pop(request.file);
         data.image = images;
         data.save();
         sendSuccessResponse({res, msg : "Data deleted"}) 
      }else{
         sendErrorResponse({ res, status : 400 , msg : file.msg} )
      }
   }).catch(err => sendErrorResponse({res, status : 400, msg : err.message}));
}