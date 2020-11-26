const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// require('dotenv').config();

const orderSchema = new mongoose.Schema({
	'total_price': { type: Number },
	'table': { type: Schema.Types.ObjectId, ref: "Table", required: true },
	'food_items': [
		{
			type: new mongoose.Schema({
				_id: { type: Schema.Types.ObjectId, ref: "FootItem", required: true },
				status: { type: Number, default: 0 }, // 0 : pending, 1: in-progress, 2: delivered, 3: canceled
			},
				{
					timestamps: true
				})
		}
	],
}, {
	timestamps: true
}, {
	toJSON: {
		virtuals: true,
	},
});


orderSchema.methods.groupFood = function groupFood(params, callback) {
	var grouped =
	{
		"pending": {},
		"in_progress": {},
		"delivered": {},
		"canceled": {}
	}
	this.food_items.forEach(function (k) {
		var tmp = JSON.parse(JSON.stringify(k))
		var single_food = tmp._id;

		switch (tmp.status) {
			case 0: {
				if (grouped.pending[single_food._id] !== undefined) {
					grouped.pending[single_food._id].qty += 1
				} else {
					grouped.pending[single_food._id] = {
						food_id: single_food._id,
						food_name: single_food.title,
						qty: 1
					}
				}
				break;
			}
			case 1: {
				if (grouped.in_progress[single_food._id] !== undefined) {
					grouped.in_progress[single_food._id].qty += 1
				} else {
					grouped.in_progress[single_food._id] = {
						food_id: single_food._id,
						food_name: single_food.title,
						qty: 1
					}
				}
				break;
			}
			case 2: {
				if (grouped.delivered[single_food._id] !== undefined) {
					grouped.delivered[single_food._id].qty += 1
				} else {
					grouped.delivered[single_food._id] = {
						food_id: single_food._id,
						food_name: single_food.title,
						qty: 1
					}
				}
				break;
			}
			case 3: {
				if (grouped.canceled[single_food._id] !== undefined) {
					grouped.canceled[single_food._id].qty += 1
				} else {
					grouped.canceled[single_food._id] = {
						food_id: single_food._id,
						food_name: single_food.title,
						qty: 1
					}
				}
				break;
			}
			default: {
				break;
			}
		}
	})
	return grouped;
}
orderSchema.methods.changeToProgress = function changeToProgress(params, callback) {
	try {
		var count = 0
		while (count < params.qty) {
			console.log(count, params.qty);
			if (this.food_items[count].status !== 1) {
				this.food_items[count].status = 1;
			} else {
				params.qty++;
			}
			count++;
		}
		this.save();
		return { success: true }
	} catch (err) {
		console.log(err.message);
		return { success: false, 'msg': err }
	}
}


orderSchema.methods.changeToPending = function changeToPending(params, callback) {
	try {
		var count = 0
		while (count < params.qty) {
			if (this.food_items[count].status !== 0) {
				this.food_items[count].status = 0;
			} else {
				params.qty++;
			}
			count++;
		}
		this.save();
		return { success: true }
	} catch (err) {
		return { success: false, 'msg': err }
	}
}

orderSchema.methods.changeToDelivered = function changeToDelivered(params, callback) {
	try {
		var count = 0
		while (count < params.qty) {
			if (this.food_items[count].status !== 2) {
				this.food_items[count].status = 2;
			} else {
				params.qty++;
			}
			count++;
		}
		this.save();
		return { success: true }
	} catch (err) {
		return { success: false, 'msg': err }
	}
}

orderSchema.methods.changeToCanceled = function changeToCanceled(params, callback) {
	try {
		var count = 0
		while (count < params.qty) {
			if (this.food_items[count].status !== 3) {
				this.food_items[count].status = 3;
			} else {
				params.qty++;
			}
			count++;
		}
		this.save();
		return { success: true }
	} catch (err) {
		return { success: false, 'msg': err }
	}
}


const Order = mongoose.model('Order', orderSchema);
module.exports = {
	Order,
}