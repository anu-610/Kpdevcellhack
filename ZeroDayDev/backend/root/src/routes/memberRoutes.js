'use strict';

const { Router }  = require('express');
const ctrl        = require('../controllers/memberController');
const protect     = require('../middleware/auth');
const validate    = require('../middleware/validate');
const { memberCreate, memberUpdate } = require('../validators/schemas');

const router = Router();


router.get('/core', ctrl.getCoreMembers); 
router.get('/',     ctrl.getAll);
router.get('/:id',  ctrl.getById);


router.post(  '/',    protect, validate(memberCreate), ctrl.create);
router.patch( '/:id', protect, validate(memberUpdate), ctrl.update);
router.delete('/:id', protect,                         ctrl.remove);

module.exports = router;