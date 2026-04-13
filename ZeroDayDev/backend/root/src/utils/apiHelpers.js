'use strict';

/**
 * Standardised API error class.
 * Throw this anywhere and the global error handler will format it correctly.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details    = details;
    this.isOperational = true; // distinguish from programmer errors
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg, details)  { return new ApiError(400, msg, details); }
  static unauthorized(msg = 'Unauthorized')    { return new ApiError(401, msg); }
  static forbidden(msg = 'Forbidden')          { return new ApiError(403, msg); }
  static notFound(resource = 'Resource')       { return new ApiError(404, `${resource} not found`); }
  static conflict(msg)                          { return new ApiError(409, msg); }
  static internal(msg = 'Internal server error') { return new ApiError(500, msg); }
}

/**
 * Standardised success response helper.
 */
class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static created(res, data, message = 'Created') {
    return ApiResponse.success(res, data, message, 201);
  }

  static paginated(res, data, pagination) {
    return res.status(200).json({ success: true, data, pagination });
  }
}

module.exports = { ApiError, ApiResponse };
