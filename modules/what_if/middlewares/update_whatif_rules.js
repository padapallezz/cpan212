const { body } = require('express-validator');
const checkValidation = require('../../../shared/middlewares/checkValidation');

const updateWhatIfRules = [
  body("scenario_name")
    .optional()
    .isString()
    .isLength({ min: 3 }),
  body("base_product")
    .optional()
    .isString(),
  body("old_price")
    .optional()
    .isFloat({ min: 0 }),
  body("new_price")
    .optional()
    .isFloat({ min: 0 }),
  body("fixed_cost")
    .optional()
    .isFloat({ min: 0 }),
  body("variable_cost")
    .optional()
    .isFloat({ min: 0 }),
  body("units_sold")
    .optional()
    .isFloat({ min: 0 }),
  body("expected_profit")
    .optional()
    .isFloat(),
  checkValidation
];

module.exports = updateWhatIfRules;