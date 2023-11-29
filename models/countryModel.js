const mongoose = require("mongoose");
const Joi = require("joi");

const countrySchema = new mongoose.Schema({
  name:String,
  capital:String,
  pop:Number,
  img:String,
  // בנוסף כל רשומה בברירת מחדל שמייצר אותה
  // ייתן לה את התאריך של עכשיו
  date:{
    type:Date, default:Date.now()
  },
  user_id:String
})

exports.CountryModel = mongoose.model("countries",countrySchema);

exports.validateCountry = (_reqBody) => {
  let schemaJoi = Joi.object({
    name:Joi.string().min(2).max(99).required(),
    capital:Joi.string().min(2).max(99).required(),
    pop:Joi.number().min(1000).max(3000000000).required(),
    img:Joi.string().min(2).max(99).allow(null,"")
  })
  return schemaJoi.validate(_reqBody)
}
