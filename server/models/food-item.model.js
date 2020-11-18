const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// require('dotenv').config();

const foodItemSchema = new mongoose.Schema({
	'title' : { type: String, required: true, minlength: 1, trim: true},
	'short_description' : { type: String, required: true, minlength: 1, maxlength: 255, trim: true},
	'long_description' : { type: String, required: true, minlength: 1, maxlength: 5000, trim: true},
	'price' : { type: Number, required: true, min: 1},
	'image': { 
		type: String,
		set: function(data) {
			return JSON.stringify(data);
		}
	},    
	'category': { type: Schema.Types.ObjectId, ref: "Category", required: true },
},{ 
	timestamps: true 
});

foodItemSchema.virtual('image_path').get(function() {
	if(this.image != null && this.image != []){
		image_urls = []
		tmp = JSON.parse(this.image)
		if(Array.isArray(tmp)){
			for(i of tmp){
				image_urls.push(`${process.env.URL}:${process.env.PORT}/food_items/${i}`)
			}
		}else{
			image_urls.push(`${process.env.URL}:${process.env.PORT}/food_items/${tmp}`)
		}
		return image_urls;
	}else{
		return null;
	}
});

foodItemSchema
    .set('toObject', { getters: true });

const FoodItem = mongoose.model('FoodItem', foodItemSchema);
module.exports = {
	FoodItem,
}