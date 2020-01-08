const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    iduser: String,
    namesp: String,
    soluong:Number,
    costsp:Number,
    img:String,
    crtime:Date,
    sumcost:Number,
    confirm:Number,
    idproduct:String,
    nameuser:String,
    trangthai:String
});

module.exports = mongoose.model('cart', cartSchema, 'carts');