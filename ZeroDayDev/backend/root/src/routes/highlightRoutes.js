'use strict';

// ════════════════════════════════════════════════════════════════════════════
// highlights.routes.js
// ════════════════════════════════════════════════════════════════════════════
const { Router } = require('express');
const { getHighlights } = require('../controllers/highlightController');

const highlightRouter = Router();

// Public — no auth required
highlightRouter.get('/', getHighlights);

module.exports = { highlightRouter };
