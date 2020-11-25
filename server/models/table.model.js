const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const tableSchema = new Schema({
    'table_name' : { type: String, required: true, minlength: 1, trim: true},
    'status': { type: Number, default: 0 } 
},{
    timestamps: true,
});

const Table = mongoose.model('Table', tableSchema);

module.exports = {
    Table,
}