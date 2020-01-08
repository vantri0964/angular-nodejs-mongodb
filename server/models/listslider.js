const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sliderSchema = new Schema({
    img: String,
    title: String,
    description:String,
   
});

module.exports = mongoose.model('listslider', sliderSchema, 'listslider');