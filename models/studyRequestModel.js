const mongoose = require('mongoose');
const Joi = require('joi')

const studyRequestSchema = new mongoose.Schema({
    topics: [String],
    preferredLanguages: [String],
    preferredHours: {
        from: Date,
        to: Date
    },
    studyDuration: {
        min: Number,
        max: Number,
    },
    user_id: String
})

exports.StudyRequestModel = mongoose.model("studyRequests", studyRequestSchema);

exports.validateStudyRequest = (_reqBody) => {
    let schemaJoi = Joi.object({
        topics: Joi.array().items(Joi.string()).min(1).required(),
        preferredLanguages: Joi.array().items(Joi.string()).min(1).required(),
        preferredHours: Joi.object({
            from: Joi.date().required(),
            to: Joi.date().required(),
        }).required().when(Joi.object({
            from: Joi.date(),
            to: Joi.date(),
        }), {
            then: Joi.object({
                from: Joi.date().required(),
                to: Joi.date().required().greater(Joi.ref('from')),
            }),
        }),
        studyDuration: Joi.object({
            min: Joi.number().required().min(5),
            max: Joi.number().required().min(Joi.ref('min')),
        }).required(),
    })
    return schemaJoi.validate(_reqBody);
}