'use strict';

const admin = require('../config/firebase');
const { ApiError } = require('../utils/apiHelpers');

/**
 * Firebase Auth guard.
 * Verifies Firebase ID token sent from frontend.
 */
async function protect(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('No token provided'));
  }

  const token = header.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    // Attach user info to request
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || null,
    };

    next();
  } catch (err) {
    next(ApiError.unauthorized('Invalid token'));
  }
}

module.exports = protect;