'use strict';

const memberService  = require('../services/memberService');
const { ApiResponse } = require('../utils/apiHelpers');

async function getAll(req, res, next) {
  try {
    // Admins can request inactive members too
    const includeInactive = req.admin && req.query.includeInactive === 'true';
    const members = await memberService.getAll({ includeInactive });
    ApiResponse.success(res, members);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const member = await memberService.getById(req.params.id);
    ApiResponse.success(res, member);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const member = await memberService.create(req.body);
    ApiResponse.created(res, member, 'Member added');
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const member = await memberService.update(req.params.id, req.body);
    ApiResponse.success(res, member, 'Member updated');
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await memberService.remove(req.params.id);
    ApiResponse.success(res, null, 'Member deleted');
  } catch (err) { next(err); }
}

async function getCoreMembers(req, res, next) {
  try {
    const members = await memberService.getAll({
      isCoreTeam: true,
      includeInactive: false
    });

    ApiResponse.success(res, members);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, getCoreMembers, create, update, remove };
