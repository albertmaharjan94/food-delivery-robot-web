const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const categorySchema = new Schema({
    'title' : { type: String, required: true, minlength: 1, trim: true}
},{
    timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);

module.exports = {
    Category,
}