const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    console.log(data)
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