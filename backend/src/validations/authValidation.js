const { body } = require('express-validator');

exports.registerValidation = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be 20-60 characters'),

  body('email')
    .isEmail()
    .withMessage('Invalid email'),

  body('password')
    .isLength({ min: 8, max: 16 })
    .matches(/[A-Z]/)
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must include uppercase & special char'),

  body('address')
    .isLength({ max: 400 })
    .withMessage('Address too long')
];