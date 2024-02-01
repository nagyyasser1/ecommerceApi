import Joi from 'joi';

import STATUS_CODES from '../../constants/STATUS_CODES.js';

// Define the Joi schema
const schema = Joi.object({
    color: Joi.string().required(),
    quantity: Joi.number().required(),
    ProductId: Joi.number().required(),
    SizeId: Joi.number().required(),
});


const validateNewProductSizeData= (req,res,next) => {
    const validationResult = schema.validate(req.body);
    if(validationResult?.error){
        return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send(validationResult.error);
    };
    next();
}

export  {
    validateNewProductSizeData
}