const Joi = require('joi');
const STATUS_CODES = require('../../constants/STATUS_CODES');

// Define the Joi schema
const schema = Joi.object({
    type: Joi.string().required(),
});


const validateNewSizeData= (req,res,next) => {
    const validationResult = schema.validate(req.body);
    if(validationResult?.error){
        return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send(validationResult.error);
    };
    next();
}

module.exports = {
    validateNewSizeData
}