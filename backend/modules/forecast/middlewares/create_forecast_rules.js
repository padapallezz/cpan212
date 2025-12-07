const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/checkValidation");

const createForecastRules = [
  body("company")
    .isString()
    .withMessage("Company name must be a string")
    .isLength({ min: 3 })
    .withMessage("Company name must be at least 3 characters")
    .notEmpty()
    .withMessage("Company name is required"),

  body("product")
    .isString()
    .withMessage("Product must be a string")
    .isLength({ min: 3 })
    .withMessage("Product must be at least 3 characters")
    .notEmpty()
    .withMessage("Product is required"),

  body("predicted_unit_sold")
    .isFloat({ min: 0 })
    .withMessage("Predicted unit sold must be a positive number")
    .notEmpty()
    .withMessage("Predicted unit sold is required"),

  body("predicted_price")
    .isFloat({ min: 0 })
    .withMessage("Predicted price must be a positive number")
    .notEmpty()
    .withMessage("Predicted price is required"),

  body("predicted_variable_cost")
    .isFloat({ min: 0 })
    .withMessage("Predicted variable cost must be a positive number")
    .notEmpty()
    .withMessage("Predicted variable cost is required"),

  body("predicted_revenue")
    .isFloat({ min: 0 })
    .withMessage("Predicted revenue must be a positive number")
    .notEmpty()
    .withMessage("Predicted revenue is required"),

  checkValidation
];

module.exports = createForecastRules;
