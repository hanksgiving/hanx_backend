//Validation
const Joi = require('@hapi/joi');

//Regsiter Validation
const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

//Login Validation
const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

//Account Validation
const accountValidation = data => {
    const schema = Joi.object({
        bankId: Joi.string().min(1).required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.accountValidation = accountValidation;
