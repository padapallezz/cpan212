const { body } = require('express-validator');
const checkValidation = require('../../../shared/middlewares/checkValidation');

const createBepRules = [
    body("product_name")
        .isString()
        .withMessage("Product name must be a string")
        .isLength({min: 3})
        .withMessage("Product name must be at least 3 characters long")
        .notEmpty()
        .withMessage("Product name is required"),


    body("variable_cost_per_unit")
        .isFloat({ gt: 0 })
        .withMessage("Variable cost per unit must be a positive number")
        .notEmpty()
        .withMessage("Variable cost per unit is required"),

    body("fixed_cost")
        .isFloat({ gt: 0 })
        .withMessage("Fixed cost per unit must be a positive number")
        .notEmpty()
        .withMessage("Fixed cost per unit is required"),

    body("selling_price_per_unit")
        .isFloat({ gt: 0 })
        .withMessage("Selling price per unit must be a positive number")
        .notEmpty()
        .withMessage("Selling price per unit is required"),

    checkValidation,
];


module.exports = createBepRules;
