const { body } = require('express-validator');
const checkValidation = require('../../../shared/middlewares/checkValidation');

// Validation rules for creating a Revenue record
const createRevenueRules = [
  body("company")
    .isString()
    .withMessage("Company name must be a string")
    .isLength({ min: 3 })
    .withMessage("Company name must be at least 3 characters long")
    .notEmpty()
    .withMessage("Company name is required"),

  body("invoice")
    .isFloat({ gt: 0 })
    .withMessage("Invoice must be a positive number")
    .notEmpty()
    .withMessage("Invoice is required"),

  body("revenue")
    .isFloat({ gt: 0 })
    .withMessage("Revenue must be a positive number")
    .notEmpty()
    .withMessage("Revenue is required"),

  body("variable_cost")
    .isFloat({ gt: 0 })
    .withMessage("Variable cost must be a positive number")
    .notEmpty()
    .withMessage("Variable cost is required"),

  body("fixed_cost")
    .isFloat({ min: 0 })
    .withMessage("Fixed cost must be a non-negative number")
    .notEmpty()
    .withMessage("Fixed cost is required"),

  body("profit")
    .isFloat()
    .withMessage("Profit must be a number")
    .notEmpty()
    .withMessage("Profit is required"),

  body("products")
    .isArray({ min: 1 })
    .withMessage("Products must be an array with at least one product"),

  body("products.*.name")
    .isString()
    .withMessage("Product name must be a string")
    .notEmpty()
    .withMessage("Product name is required"),

  body("products.*.units_sold")
    .isFloat({ gt: 0 })
    .withMessage("Units sold must be a positive number")
    .notEmpty()
    .withMessage("Units sold is required"),

  body("products.*.price")
    .isFloat({ gt: 0 })
    .withMessage("Product price must be a positive number")
    .notEmpty()
    .withMessage("Product price is required"),

  body("products.*.variable_cost")
    .isFloat({ gt: 0 })
    .withMessage("Product variable cost must be a positive number")
    .notEmpty()
    .withMessage("Product variable cost is required"),

  checkValidation
];

module.exports = createRevenueRules