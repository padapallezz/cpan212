const { body } = require('express-validator');
const checkValidation = require('../../../shared/middlewares/checkValidation');

const updateBepRules = [
    body("company_name")
        .optional()
        .isString()
        .withMessage("Company name must be a string")
        .isLength({ min: 3 })
        .withMessage("Company name must be at least 3 characters long"),
    body("scenario_name")
        .optional()
        .isString()
        .withMessage("Scenario name must be a string")
        .isLength({ min: 10 })
        .withMessage("Scenario name must be at least 10 characters long"),
    body("variable_cost_per_unit")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Variable cost per unit must be a positive number"),
    body("fixed_cost")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Fixed cost must be a positive number"),
    body("selling_price_per_unit")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Selling price per unit must be a positive number"),
    body("bep_unit")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("BEP unit must be a positive number"),

    checkValidation,
];

module.exports = updateBepRules;
