const Joi = require('joi');
const { REGEX, ERROR_MESSAGES } = require('../constants');

// Register Validation
function validateRegister(body) {
    const registerSchema = Joi.object({
        name: Joi
            .string()
            .pattern(REGEX.NAME)
            .required()
            .messages({
                'string.pattern.base': ERROR_MESSAGES.name,
                'any.required': ERROR_MESSAGES.required('Name')
            }),
        email: Joi
            .string()
            .pattern(REGEX.EMAIL)
            .required()
            .messages({
                'string.pattern.base': ERROR_MESSAGES.email,
                'any.required': ERROR_MESSAGES.required('Email')
            }),
        password: Joi
            .string()
            .pattern(REGEX.PASSWORD)
            .required()
            .messages({
                'string.pattern.base': ERROR_MESSAGES.password,
                'any.required': ERROR_MESSAGES.required('Password')
            }),
        confirmPassword: Joi
            .string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': ERROR_MESSAGES.passwordMatch,
                'any.required': ERROR_MESSAGES.required('Confirm Password')
            }),
        phone: Joi
            .string()
            .pattern(REGEX.PHONE)
            .optional()
            .allow('')
            .messages({
                'string.pattern.base': ERROR_MESSAGES.phone
            }),
        role: Joi
            .string()
            .required()
            .messages({
                'any.required': ERROR_MESSAGES.required('Role')
            }),
    });
    return registerSchema.validate(body);
}

// Login Validation
function validateLogin(body) {
    const loginSchema = Joi.object({
        email: Joi
            .string()
            .pattern(REGEX.EMAIL)
            .required()
            .messages({
                'string.pattern.base': ERROR_MESSAGES.email,
                'any.required': ERROR_MESSAGES.required('Email')
            }),
        password: Joi
            .string()
            .pattern(REGEX.PASSWORD)
            .required()
            .messages({
                'string.pattern.base': ERROR_MESSAGES.password,
                'any.required': ERROR_MESSAGES.required('Password')
            }),
    });
    return loginSchema.validate(body);
}

// Email Validation
function validateEmail(body) {
    const emailSchema = Joi.object({
        email: Joi
            .string()
            .pattern(REGEX.EMAIL)
            .required()
            .messages({
                'string.pattern.base': ERROR_MESSAGES.email,
                'any.required': ERROR_MESSAGES.required('Email')
            }),
    });
    return emailSchema.validate(body);
}

// Password Validation with Confirm Password
function validatePassword(body) {
    const passwordSchema = Joi.object({
        password: Joi
            .string()
            .pattern(REGEX.PASSWORD)
            .required()
            .messages({
                'string.pattern.base': ERROR_MESSAGES.password,
                'any.required': ERROR_MESSAGES.required('Password')
            }),
        confirmPassword: Joi
            .string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': ERROR_MESSAGES.passwordMatch,
                'any.required': ERROR_MESSAGES.required('Confirm Password')
            }),
    });
    return passwordSchema.validate(body);
}

module.exports.validateForms = {
    validateRegister,
    validateLogin,
    validateEmail,
    validatePassword
};