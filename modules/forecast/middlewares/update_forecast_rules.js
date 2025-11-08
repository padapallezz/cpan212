const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/checkValidation");

const updateForecastRules = [
  body("company")
    .optional()
    .isString()
    .withMessage("Company name must be a string")
    .isLength({ min: 3 })
    .withMessage("Company name must be at least 3 characters"),

  body("product")
    .optional()
    .isString()
    .withMessage("Product must be a string")
    .isLength({ min: 3 })
    .withMessage("Product must be at least 3 characters"),

  body("predicted_unit_sold")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Predicted unit sold must be a positive number"),

  body("predicted_price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Predicted price must be a positive number"),

  body("predicted_variable_cost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Predicted variable cost must be a positive number"),

  body("predicted_revenue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Predicted revenue must be a positive number"),

  checkValidation
];

module.exports = updateForecastRules;
