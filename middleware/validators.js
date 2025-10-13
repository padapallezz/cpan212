const { body, validationResult } = require("express-validator");

// Shared error handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

//
// USER VALIDATORS
//
const validateUser = [
  body("user_name").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  handleValidation,
];

const validateUserUpdate = [
  body("user_name").optional().notEmpty(),
  body("email").optional().isEmail(),
  body("password").optional().isLength({ min: 6 }),
  handleValidation,
];

//
// FORECAST VALIDATORS
//
const validateForecast = [
  body("region").notEmpty().withMessage("Region is required"),
  body("expectedRevenue").isNumeric().withMessage("Expected revenue must be a number"),
  body("month").notEmpty().withMessage("Month is required"),
  handleValidation,
];

const validateForecastUpdate = [
  body("region").optional().notEmpty(),
  body("expectedRevenue").optional().isNumeric(),
  body("month").optional().notEmpty(),
  handleValidation,
];

//
// REVENUE VALIDATORS
//
const validateRevenue = [
  body("source").notEmpty().withMessage("Source is required"),
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("date").isISO8601().withMessage("Date must be valid"),
  handleValidation,
];

const validateRevenueUpdate = [
  body("source").optional().notEmpty(),
  body("amount").optional().isNumeric(),
  body("date").optional().isISO8601(),
  handleValidation,
];

//
// WHAT-IF SCENARIO VALIDATORS
//
const validateScenario = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("impact").isNumeric().withMessage("Impact must be a number"),
  handleValidation,
];

const validateScenarioUpdate = [
  body("title").optional().notEmpty(),
  body("description").optional().notEmpty(),
  body("impact").optional().isNumeric(),
  handleValidation,
];

module.exports = {
  validateUser,
  validateUserUpdate,
  validateForecast,
  validateForecastUpdate,
  validateRevenue,
  validateRevenueUpdate,
  validateScenario,
  validateScenarioUpdate,
};
