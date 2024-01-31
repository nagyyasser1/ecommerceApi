import Joi from 'joi';

import STATUS_CODES from '../../constants/STATUS_CODES.js';

// Define the Joi schema
const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});


const validateUserRegisterData = (req,res,next) => {
    const validationResult = schema.validate(req.body);
    if(validationResult?.error){
        return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send(validationResult.error);
    };
    next();
}

export  {
    validateUserRegisterData
}