'use strict';

const projectService  = require('../services/projectService');
const { ApiResponse } = require('../utils/apiHelpers');

async function getAll(req, res, next) {
  try {
    const { category, status, isFeatured, search, page, limit } = req.query;
    const result = await projectService.getAll({ category, status, isFeatured, search, page, limit });
    ApiResponse.paginated(res, result.projects, result.pagination);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const project = await projectService.getById(req.params.id);
    ApiResponse.success(res, project);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const project = await projectService.create(req.body);
    ApiResponse.created(res, project, 'Project added');
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const project = await projectService.update(req.params.id, req.body);
    ApiResponse.success(res, project, 'Project updated');
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await projectService.remove(req.params.id);
    ApiResponse.success(res, null, 'Project deleted');
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove };
