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

            data = data.map(function (q, i) {

               q.grouped = q.groupFood();

               return {
                  id: q._id,
                  table_id: q.table._id,
                  table_name: q.table.table_name,
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
   try {
      await Order.findById(req.params.id)
         .populate({
            path: 'food_items._id',
            model: 'FoodItem'
         })
         .populate({
            path: 'table',
         })
         .exec(function (err, data) {

            var grouped = data.groupFood();

            data = {
               id: data._id,
               table_id: data.table._id,
               table_name: data.table.table_name,
               food_items: grouped
            };

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


//  put
exports.updatePendingToInProgress = async (req, res) => {
   try {
      await Order.findById(req.params.id)
         .populate({
            path: 'food_items._id',
            model: 'FoodItem'
         })
         .populate({
            path: 'table',
         })
         .exec(async function (err, data) {
            var grouped = await data.groupFood();
            var id = req.body.food_id;
            var qty = req.body.qty ? req.body.qty : 1;
            var food = grouped.pending[id];

            if (!food || food === undefined) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: "No food found in pending."
               });
               return;
            }
            if (food !== undefined && qty > food.qty) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: "Food exceeds pending order"
               });
               return;
            }
            var stat = data.changeToProgress({ food, qty })
            if (stat.success === false) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: stat.msg
               });
            }

            sendSuccessResponse({
               res,
               msg: 'Successfully updated'
            });
         });
   } catch (err) {
      sendErrorResponse({
         res,
         status: 400,
         msg: err.message
      });
   }
}

exports.updateProgressToPending = async (req, res) => {
   try {
      await Order.findById(req.params.id)
         .populate({
            path: 'food_items._id',
            model: 'FoodItem'
         })
         .populate({
            path: 'table',
         })
         .exec(async function (err, data) {
            var grouped = await data.groupFood();
            var id = req.body.food_id;
            var qty = req.body.qty ? req.body.qty : 1;
            var food = grouped.in_progress[id];

            if (!food || food === undefined) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: "No food found in in progress."
               });
               return;
            }
            if (food !== undefined && qty > food.qty) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: "Food exceeds in progress order"
               });
               return;
            }
            var stat = data.changeToPending({ food, qty })
            if (stat.success === false) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: stat.msg
               });
            }

            sendSuccessResponse({
               res,
               msg: 'Successfully updated'
            });
         });
   } catch (err) {
      sendErrorResponse({
         res,
         status: 400,
         msg: err.message
      });
   }
}

exports.updateInProgressToDelivered = async (req, res) => {
   try {
      await Order.findById(req.params.id)
         .populate({
            path: 'food_items._id',
            model: 'FoodItem'
         })
         .populate({
            path: 'table',
         })
         .exec(async function (err, data) {
            var grouped = await data.groupFood();
            var id = req.body.food_id;
            var qty = req.body.qty ? req.body.qty : 1;

            var food = grouped.in_progress[id];

            if (!food || food === undefined) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: "No food found in in progress."
               });
               return;
            }
            if (food !== undefined && qty > food.qty) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: "Food exceeds in progress order"
               });
               return;
            }
            var stat = data.changeToDelivered({ food, qty })
            if (stat.success === false) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: stat.msg
               });
            }

            sendSuccessResponse({
               res,
               msg: 'Successfully updated'
            });
         });
   } catch (err) {
      sendErrorResponse({
         res,
         status: 400,
         msg: err.message
      });
   }
}


exports.updateDeliveredToInProgress = async (req, res) => {
   try {
      await Order.findById(req.params.id)
         .populate({
            path: 'food_items._id',
            model: 'FoodItem'
         })
         .populate({
            path: 'table',
         })
         .exec(async function (err, data) {
            var grouped = await data.groupFood();
            var id = req.body.food_id;
            var qty = req.body.qty ? req.body.qty : 1;

            var food = grouped.delivered[id];

            if (!food || food === undefined) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: "No food found in in progress."
               });
               return;
            }
            if (food !== undefined && qty > food.qty) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: "Food exceeds in progress order"
               });
               return;
            }
            var stat = data.changeToProgress({ food, qty })
            if (stat.success === false) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: stat.msg
               });
            }

            sendSuccessResponse({
               res,
               msg: 'Successfully updated'
            });
         });
   } catch (err) {
      sendErrorResponse({
         res,
         status: 400,
         msg: err.message
      });
   }
}

exports.updatePendingToCanceled = async (req, res) => {
   try {
      await Order.findById(req.params.id)
         .populate({
            path: 'food_items._id',
            model: 'FoodItem'
         })
         .populate({
            path: 'table',
         })
         .exec(async function (err, data) {
            var grouped = await data.groupFood();
            var id = req.body.food_id;
            var qty = req.body.qty ? req.body.qty : 1;

            var food = grouped.pending[id];

            if (!food || food === undefined) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: "No food found in pending."
               });
               return;
            }
            if (food !== undefined && qty > food.qty) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: "Food exceeds in pending"
               });
               return;
            }
            var stat = data.changeToCanceled({ food, qty })
            if (stat.success === false) {
               sendErrorResponse({
                  res,
                  status: 400,
                  msg: stat.msg
               });
            }

            sendSuccessResponse({
               res,
               msg: 'Successfully updated'
            });
         });
   } catch (err) {
      sendErrorResponse({
         res,
         status: 400,
         msg: err.message
      });
   }
}