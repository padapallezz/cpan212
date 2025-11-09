const { body } = require('express-validator');
const checkValidation = require('../../../shared/middlewares/checkValidation');

const createWhatIfRules = [
  body("scenario_name")
    .isString().withMessage("Scenario name must be a string")
    .isLength({ min: 3 }).withMessage("Scenario name must be at least 3 characters")
    .notEmpty().withMessage("Scenario name is required"),

  body("base_product")
    .isString().withMessage("Base product must be a string")
    .notEmpty().withMessage("Base product is required"),

  body("old_price")
    .isFloat({ min: 0 }).withMessage("Old price must be non-negative")
    .notEmpty().withMessage("Old price is required"),

  body("new_price")
    .isFloat({ min: 0 }).withMessage("New price must be non-negative")
    .notEmpty().withMessage("New price is required"),

  body("fixed_cost")
    .isFloat({ min: 0 }).withMessage("Fixed cost must be non-negative")
    .notEmpty().withMessage("Fixed cost is required"),

  body("variable_cost")
    .isFloat({ min: 0 }).withMessage("Variable cost must be non-negative")
    .notEmpty().withMessage("Variable cost is required"),

  body("units_sold")
    .isFloat({ min: 0 }).withMessage("Units sold must be non-negative")
    .notEmpty().withMessage("Units sold is required"),

  body("expected_profit")
    .isFloat().withMessage("Expected profit must be a number")
    .notEmpty().withMessage("Expected profit is required"),

  checkValidation
];

module.exports = createWhatIfRules;
