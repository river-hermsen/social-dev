const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    console.log(data)
    if (!validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = 'Name must be between 2 and 30 characters';
    }

    if (!validator.isEmail(data.email)) {
        errors.email = 'Email address is not valid';
    }

    if (!validator.isLength(data.password, { min: 6, max: 32 })) {
        errors.password = 'Password must be between 6 and 32 characters';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}