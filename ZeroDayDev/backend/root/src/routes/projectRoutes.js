'use strict';

const { Router }  = require('express');
const ctrl        = require('../controllers/projectController');
const protect     = require('../middleware/auth');
const validate    = require('../middleware/validate');
const { projectCreate, projectUpdate } = require('../validators/schemas');

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────
router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);

// ── Admin-only ────────────────────────────────────────────────────────────
router.post(  '/',    protect, validate(projectCreate), ctrl.create);
router.patch( '/:id', protect, validate(projectUpdate), ctrl.update);
router.delete('/:id', protect,                          ctrl.remove);

module.exports = router;