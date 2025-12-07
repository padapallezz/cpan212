const {body, validationResult} = require('express-validator');

const validateUser= [
    body('id').isInt().withMessage('ID must be an integer'),
    body('username').isString().withMessage('Username must be a string').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email format').notEmpty().withMessage('Email is required'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long').notEmpty().withMessage('Password is required'),
(req, res, next) => {
    const errors= validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();

}
];
const validateUserUpdate= [
    body('username').optional().isString().withMessage('Username must be a string').notEmpty().withMessage('Username cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email format').notEmpty().withMessage('Email cannot be empty'),
    body('password').optional().isLength({min:6}).withMessage('Password must be at least 6 characters long').notEmpty().withMessage('Password cannot be empty'),
(req, res, next) => {
    const errors= validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
},
];
module.exports={validateUser,validateUserUpdate};