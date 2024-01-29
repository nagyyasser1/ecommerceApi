const Joi = require('joi');
const db = require('../models');

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

const validateProductData = (data) => {
    const validationResult = schema.validate(data);

    if (validationResult.error) {
        return {
            isValid: false,
            error: validationResult.error.details[0].message
        };
    }

    return { isValid: true };
};

const sizesExists = async (sizes) => {

    const error = []

    for (const sizeData of sizes) {
        const { sizeId } = sizeData;

        const sizeExists = await db.Size.findOne({
            where: { sizeId }
        });

        if (!sizeExists) {
            error.push(`Size with sizeId '${sizeId}' does not exist in the database.`);
        }
    }

    if (error.length > 0) {
        return {
            isValid: false,
            error
        }
    }


    return { isValid: true };

}

const categoryExists = async (categoryId) => {
    const category = await db.Category.findByPk(categoryId);
    if (!category) {
        return {
            isValid: false,
            error: `categoryId ${categoryId} not found!`
        }
    }

    return {
        isValid: true
    }
}

module.exports = {
    validateProductData,
    sizesExists,
    categoryExists
}