const Joi = require('joi');
const { sequelize } = require('../../models');
const STATUS_CODES = require('../../constants/STATUS_CODES');

const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    categoryId: Joi.number().required(),
    isFeatured: Joi.boolean().required(),
    sizes: Joi.array().items(
        Joi.object({
            quantity: Joi.number().required(),
            sizeId: Joi.string().required()
        })
    )
});

const validateProductData = (req, res, next) => {

    const sizesStr = req.body?.sizes;

    const sizesArr = JSON.parse(sizesStr);


    const theNewBody = {...req.body, sizes: sizesArr}
    
    const validationResult = schema.validate(theNewBody);

    if (validationResult.error) {
        return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send(validationResult.error);
    };

    req.body.sizes = sizesArr;

    next();
};

const sizesExist = async (sizes) => {
    const errors = [];

    for (const sizeData of sizes) {
        const { sizeId } = sizeData;

        const sizeExists = await sequelize.models.Size.findByPk(sizeId);
        if (!sizeExists) {
            errors.push(`Size with sizeId '${sizeId}' does not exist in the database.`);
        }
    }

    if (errors.length > 0) {
        return {
            isValid: false,
            error: errors
        };
    }

    return { isValid: true };
};


const categoryExists = async (categoryId) => {
    try {
        const category = await sequelize.models.Category.findByPk(categoryId);

        if (!category) {
            return {
                isValid: false,
                error: `Category with ID ${categoryId} not found!`
            };
        }else{
            return {
                isValid: true
            };
        }

    } catch (error) {
        return {
            isValid: false,
            error: `Error while checking category existence: ${error.message}`
        };
    }
};


module.exports = {
    validateProductData,
    sizesExist,
    categoryExists
}