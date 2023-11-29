// 4
const mongoose = require('mongoose');
const Joi = require('joi')

const cakesSchema = new mongoose.Schema({
    name:String,
    cals:Number,
    price:Number,
    img:String,
    user_id:String,
    date_created:{
      type:Date, default:Date.now()
    },
    category_id:{
      type:String,default:"1"
    }
})

exports.CakesModel = mongoose.model("cakes", cakesSchema);

exports.validateCake = (_reqBody) =>{
    let schemaJoi = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        cals: Joi.number().min(0).max(9999).required(),
        price: Joi.number().min(1).max(9999).required(),
        img: Joi.string().min(2).max(500).allow(null,"")
    })
    return schemaJoi.validate(_reqBody);
}
