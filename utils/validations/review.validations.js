import Joi from 'joi';

import STATUS_CODES from '../../constants/STATUS_CODES.js';

// Define the Joi schema
const schema = Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required(),
    productId: Joi.number().required(),
});


const validateNewReviewData= (req,res,next) => {
    const validationResult = schema.validate(req.body);
    if(validationResult?.error){
        return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send(validationResult.error);
    };
    next();
}

export  {
    validateNewReviewData
}