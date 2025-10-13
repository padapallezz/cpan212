const {body, validationResult} = require('express-validator');

const validateForecast= [
    body('id').isInt().withMessage('ID must be an integer'),
    body('product').isString().withMessage('Product must be a string').notEmpty().withMessage('Product is required'),
    body('sales').isFloat({min:0}).withMessage('Sales must be a positive number').notEmpty().withMessage('Sales is required'),
    body('month').isISO8601().withMessage('Month must be in ISO 8601 format').notEmpty().withMessage('Month is required'),
(req, res, next) => {
    const errors= validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();

}
];
const validateForecastUpdate= [
    body('product').optional().
isString().withMessage('Product must be a string').notEmpty().withMessage('Product cannot be empty'),

    body('sales').optional().isFloat({min:0}).withMessage('Sales must be a positive number').notEmpty().withMessage('Sales cannot be empty'),
    body('month').optional().isISO8601().withMessage('Month must be in ISO 8601 format').notEmpty().withMessage('Month cannot be empty'),
(req, res, next) => {
    const errors= validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }},]

    next();