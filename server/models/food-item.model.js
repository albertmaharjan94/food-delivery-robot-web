const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodItemSchema = new mongoose.Schema({
	'title' : { type: String, required: true, minlength: 1, trim: true},
	'short_description' : { type: String, required: true, minlength: 1, maxlength: 255, trim: true},
	'long_description' : { type: String, required: true, minlength: 1, maxlength: 5000, trim: true},
	'image': { 
		type: String,
		// get: function(data) {
		// 	try { 
		// 		image_urls = []
		// 		tmp = JSON.parse(data)
		// 		for(i of tmp){
		// 			console.log(i);
		// 			image_urls.push(`/foot_items/${i}`)
		// 		}
		// 		console.log(image_urls);
		// 		return image_urls;
		// 	} catch(err) { 
		// 		console.log(err)
		// 	  	return data;
		// 	}
		// },
		set: function(data) {
			return JSON.stringify(data);
		}
	},    
	'category': { type: Schema.Types.ObjectId, ref: "Category" },
},{ 
	timestamps: true 
});
foodItemSchema.virtual('image_url').get(function() {
	if(this.image != null && this.image != []){
		image_urls = []
		tmp = JSON.parse(this.image)
		for(i of tmp){
			image_urls.push(i)
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