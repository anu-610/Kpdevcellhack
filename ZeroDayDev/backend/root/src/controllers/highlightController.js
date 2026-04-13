'use strict';

const memberService  = require('../services/memberService');
const projectService = require('../services/projectService');
const { ApiResponse } = require('../utils/apiHelpers');

/**
 * GET /api/highlights
 * Single endpoint that powers the public homepage.
 * Returns member count, core team, and featured projects in one shot.
 */
async function getHighlights(req, res, next) {
  try {
    const [memberData, featuredProjects] = await Promise.all([
      memberService.getHighlights(),
      projectService.getFeatured(6),
    ]);

    ApiResponse.success(res, {
      totalMembers:    memberData.totalMembers,
      coreTeam:        memberData.coreTeam,
      featuredProjects,
      stats: {
        totalProjects: await require('../models/Project').countDocuments({ status: { $ne: 'archived' } }),
        activeSince:   '2020',   // update to your club founding year
      },
    }, 'Highlights fetched');
  } catch (err) {
    next(err);
  }
}

module.exports = { getHighlights };
