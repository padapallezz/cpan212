const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/checkValidation");



const registerRules = [
  body("name").optional().isString().withMessage("nameString").trim(),

  body("email")
    .notEmpty()
    .withMessage("emailRequired")
    .isEmail()
    .withMessage("emailInvalid")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("passwordRequired")
    .isLength({ min: 8 })
    .withMessage("passwordLength")
    .matches(/\d/)
    .withMessage("passwordNumber"),

  body("phone")
    .optional()
    .matches(/^\d{3}-\d{3}-\d{4}$/)
    .withMessage("phoneFormat"),

  body("address")
    .optional()
    .isString()
    .withMessage("addressString")
    .trim(),

  checkValidation,
];

module.exports = registerRules;
