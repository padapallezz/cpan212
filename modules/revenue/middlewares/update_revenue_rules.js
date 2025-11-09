const { body } = require('express-validator');
const checkValidation = require('../../../shared/middlewares/checkValidation');

const updateRevenueRules = [
  body("company")
    .optional()
    .isString()
    .withMessage("Company name must be a string")
    .isLength({ min: 3 })
    .withMessage("Company name must be at least 3 characters long"),

  body("invoice")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Invoice must be a positive number"),

  body("revenue")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Revenue must be a positive number"),

  body("variable_cost")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Variable cost must be a positive number"),

  body("fixed_cost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Fixed cost must be a non-negative number"),

  body("profit")
    .optional()
    .isFloat()
    .withMessage("Profit must be a number"),

  body("products")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Products must be an array with at least one product"),

  body("products.*.name")
    .optional()
    .isString()
    .withMessage("Product name must be a string"),

  body("products.*.units_sold")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Units sold must be a positive number"),

  body("products.*.price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Product price must be a positive number"),

  body("products.*.variable_cost")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Product variable cost must be a positive number"),

  checkValidation
];

module.exports = updateRevenueRules;