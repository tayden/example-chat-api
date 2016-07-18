// Heavily inspired by Sequelize validations
// For each key in the validations parameter, if that key is in the request.body
// run it through the validations defined in it's object attribute value.

// E.g if validations = { 'organizations': { isAscii: {msg: 'Organization must be Ascii'} }}
// The organizations attribut in the body will be tested using validator.js' isAscii method.
// You may also pass a function to test for validation that should throw an error on failure.
// The validations work exactly as Sequelizes, except without any extra validations defined outside
// of validator.js. For custom validations, pass a function as the attribute object.

const validator = require('validator');

module.exports = (validations) => {
  return function *(next) {
    let body = this.request.body;
    let errors = {};

    Object.keys(validations).forEach((attrKey) => {
      Object.keys(validations[attrKey]).forEach((vKey) => {
        let vVal = validations[attrKey][vKey];
        let attrVal = this.request.body[attrKey];

        let passed = false;
        let msg;

        if(attrVal){
          attrVal = attrVal + ''; //coerce to string

          // Validator attrKey is a function
          if(isFunction(vVal)) {
            try {
              vVal(attrKey, body);
              passed = true;
            }
            catch(err) { msg = err.message; }
          }

          // Validator attrKey is an object with args and msg attrKeyibutes
          else if(vVal !== null && typeof vVal === 'object') {
            let args = vVal['args'];
            msg = vVal['msg'];
            passed = validator[vKey].call(this, body[attrKey], args);
          }

          // Validator attrKey is a simple array or string of args
          else {
            msg = `${body[attrKey]} failed test '${vKey}'`;
            passed = validator[vKey].call(this, body[attrKey], vVal);
          }

          // Add error to error list
          if(!passed) {
            errors[attrKey] = errors[attrKey] || [];
            errors[attrKey].push(msg);
          }
        }
      });
    });

    // Return errors and stop request propagation
    if(Object.keys(errors).length > 0) {
      this.status = 400;
      this.body = errors;
      return;
    }

    yield next;
  };
};

function isFunction(functionToCheck) {
  let getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
