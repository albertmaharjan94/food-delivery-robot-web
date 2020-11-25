const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// require('dotenv').config();

const orderSchema = new mongoose.Schema({
	'total_price': { type: Number },
	'table': { type: Schema.Types.ObjectId, ref: "Table", required: true },
	'food_items': [
		{ 
			// type: new mongoose.Schema({
				_id: { type: Schema.Types.ObjectId, ref: "FootItem", required: true }, 
				// status: { type: Number, default: 0 },
			// },
			// {
			// 	timestamps: true
			// })
		}
	],
}, {
	timestamps: true
}, {
	toJSON: {
		virtuals: true,
	},
});

const Order = mongoose.model('Order', orderSchema);
module.exports = {
	Order,
}