'use strict';
// ════════════════════════════════════════════════════════════════════════════
// validate.js  –  Joi schema middleware factory
// ════════════════════════════════════════════════════════════════════════════
const { ApiError } = require('../utils/apiHelpers');

/**
 * Returns an Express middleware that validates req.body against a Joi schema.
 * On failure it throws a 400 ApiError with a clean list of messages.
 */
function validate(schema, target = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly:      false,
      stripUnknown:    true,
      allowUnknown:    false,
    });

    if (error) {
      const details = error.details.map((d) => d.message.replace(/['"]/g, ''));
      return next(ApiError.badRequest('Validation failed', details));
    }

    req[target] = value; // replace with sanitised, cast value
    next();
  };
}

module.exports = validate;
