const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret")

let userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    date_created: {
        type: Date, default: Date.now()
    },
    role: {
        type: String, default: "user"
    },
    img_url:String
})

exports.UserModel = mongoose.model("users", userSchema);

exports.createToken = (_id, role) => {
    const expiresIn = "60mins";
    let token = jwt.sign({ _id, role }, config.tokenSecret, { expiresIn: expiresIn });
    return token;
}

exports.validUser = (_reqBody) => {

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,99}$/;
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().regex(passwordRegex).required(),
        img_url: Joi.string().max(500).default("https://www.pinterest.com/pin/128774870589304086")
        })

    return joiSchema.validate(_reqBody);
}

exports.validLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(3).max(99).required()
    })

    return joiSchema.validate(_reqBody);
}

// if the database is different:
// update userSchema, validUser and somtimes also validLogin