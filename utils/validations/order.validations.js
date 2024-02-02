import Joi from "joi";
import STATUS_CODES from "../../constants/STATUS_CODES.js";

// Define the Joi schema
const schema = Joi.object({
  shipping_address: Joi.object({
    // Use camelCase for consistency
    city: Joi.string().required(),
    town: Joi.string().required(),
    street: Joi.string().required(),
  }).required(),
  products: Joi.array()
    .items(
      Joi.object({
        ProductId: Joi.number().required(), // Use camelCase for consistency
        SizeId: Joi.number().required(), // Use camelCase for consistency
        quantity: Joi.number().required().integer(), // Ensure quantity is an integer
        color: Joi.string().required().trim(),
      }).required()
    )
    .required(),
});

const validateNewOrderData = (req, res, next) => {
  const { error } = schema.validate(req.body); // Destructuring for error
  if (error) {
    return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send(error.details[0]); // Send specific error detail
  }
  console.log("Validation successful:", req.body); // Log validated data
  next();
};

export { validateNewOrderData };
