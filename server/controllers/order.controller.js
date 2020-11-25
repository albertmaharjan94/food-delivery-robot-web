const {
   Order
} = require("../models/order.model");
const {
   Table
} = require("../models/table.model");
const {
   sendSuccessResponse,
   sendErrorResponse
} = require("../helpers/index");

/**
 * GET/
 * retrieve and display all data from model
 */
exports.index = async (req, res) => {
   try {
      await Order.find({})
         .populate({
            path: 'food_items._id',
            model: 'FoodItem'
         })
         .populate({
            path: 'table',
         })
         .exec(function (err, data) {
            data.forEach(function (e, i) {
               var grouped =
               {
                  "pending": {},
                  "in_progress": {},
                  "delivered": {},
                  "canceled": {}
               }
               e.food_items.forEach(function (k) {
                  var tmp = JSON.parse(JSON.stringify(k))
                  var single_food = tmp._id
                  let id = single_food._id;
                  switch (tmp.status) {
                     case 0: {

                        if (grouped.pending[id] !== undefined) {
                           grouped.pending[id].qty += 1
                        } else {
                           grouped.pending[id] = {
                              food_name: single_food.title,
                              qty: 1
                           }
                        }
                        break;
                     }
                     case 2: {
                        grouped.in_progress.push(single_food);
                        break;
                     }
                     case 3: {
                        grouped.delivered.push(single_food);
                        break;
                     }
                     case 4: {
                        grouped.canceled.push(single_food);
                        break;
                     }
                     default: {
                        break;
                     }
                  }
               })
               data[i].grouped = grouped;
            })

            data = data.map(function (q) {

               return {
                  id: q._id,
                  table: q.table.table_name,
                  food_items: q.grouped
               };
            });

            sendSuccessResponse({
               res,
               data: data,
            });
         });
   } catch (err) {
      sendErrorResponse({
         res,
         status: 400,
         msg: err.message
      });
   }
};

/**
 * GET/
 * retrieve and display instance data from model
 */
exports.show = async (req, res) => {
   await Order.findById(req.params.id)
      .populate("category")
      .then((data) => {
         var filtered = {
            id: data.id,
            title: data.title,
            short_description: data.short_description,
            long_description: data.long_description,
            price: data.price,
            image_url: data.image_path,
            category_id: data.category ? data.category.id : null,
            category: data.category ? data.category.title : null,
         };
         sendSuccessResponse({
            res,
            data: filtered
         });
      })
      .catch((err) =>
         sendErrorResponse({
            res,
            status: 400,
            msg: err.message
         })
      );
};

/**
 * POST/
 * Add a new instance to database
 */
exports.store = async (req, res) => {
   var order = await Order.find({
      table: req.body.table
   }).populate({
      path: "table",
      match: {
         status: 1
      },
   });

   if (order.length !== 0) {
      sendErrorResponse({
         res,
         status: 400,
         msg: "Orders in this table hasn't been cleared.",
      });
      return;
   }

   var foods = req.body.food_items;
   var food_items = [];
   for (var i of foods) {
      if (i.qty >= 1) {
         food_items.push(...Array(parseInt(i.qty)).fill(i._id));
      }
   }
   food_items = food_items.map(function (data) {
      return {
         _id: data,
      };
   });

   const request = req.body;

   let orderData = {
      table: request.table,
      food_items: food_items
   };
   const newOrder = new Order(orderData);

   const validatedModel = newOrder.validateSync();
   if (!!validatedModel) {
      sendErrorResponse({
         res,
         status: 400,
         msg: validatedModel.message
      });
      return;
   }

   newOrder.save();
   await Table.findByIdAndUpdate(request.table, {
      status: 1
   });
   sendSuccessResponse({
      res,
      msg: "Data saved"
   });
};

exports.addItems = async (req, res) => {
   var order = await Order.findById(req.params.id);
   if (!order) {
      sendSuccessResponse({
         res,
         msg: "No records found"
      });
   }
   var foods = req.body.food_items;
   var food_items = [];
   for (var i of foods) {
      if (i.qty >= 1) {
         food_items.push(...Array(parseInt(i.qty)).fill(i._id));
      }
   }
   food_items = food_items.map(function (data) {
      return {
         _id: data,
      };
   });
   await order.updateOne(
      {
         "$push":
         {
            "food_items":
            {
               "$each": food_items
            }
         }
      }
   ).then((data) => {
      sendSuccessResponse({
         res,
         msg: "Data updated"
      });
   })
      .catch((err) =>
         sendErrorResponse({
            res,
            status: 400,
            msg: err.message
         })
      );

}
/**
 * PUT/
 * Update instace by id
 */
exports.update = async (req, res) => {
   const request = req.body;

   let orderData = {
      title: request.title,
      short_description: request.short_description,
      long_description: request.long_description,
      category: request.category,
      price: request.price,
   };

   await Order.findByIdAndUpdate(req.params.id, orderData)
      .then((data) => {
         sendSuccessResponse({
            res,
            msg: "Data updated"
         });
      })
      .catch((err) =>
         sendErrorResponse({
            res,
            status: 400,
            msg: err.message
         })
      );
};

/**
 * Delete/
 * delete instance data from model
 */
exports.destroy = async (req, res) => {
   await Order.findByIdAndDelete(req.params.id)
      .then((data) => {
         sendSuccessResponse({
            res,
            msg: "Data deleted"
         });
      })
      .catch((err) =>
         sendErrorResponse({
            res,
            status: 400,
            msg: err.message
         })
      );
};