'use strict';

/**
 * Run with:  node src/utils/generateAdminToken.js
 *
 * Prints a JWT you can paste into Authorization: Bearer <token>
 * for all admin write routes (POST/PATCH/DELETE members & projects).
 *
 * Store the token securely — treat it like a password.
 */

require('dotenv').config();
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { role: 'admin', iss: 'devcell-backend' },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

console.log('\n── Admin JWT ──────────────────────────────────────────────');
console.log(token);
console.log('──────────────────────────────────────────────────────────\n');
console.log('Add this header to admin requests:');
console.log(`Authorization: Bearer ${token}\n`);
