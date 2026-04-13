'use strict';

const Project   = require('../models/Project');
const { ApiError } = require('../utils/apiHelpers');

class ProjectService {
  /**
   * Paginated project listing with optional filters.
   */
  async getAll({ category, status, isFeatured, search, page = 1, limit = 12 } = {}) {
    const filter = {};
    if (category)   filter.category   = category;
    if (status)     filter.status     = status;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (search)     filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate('members.member', 'name role avatar')
        .sort({ isFeatured: -1, order: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Project.countDocuments(filter),
    ]);

    return {
      projects,
      pagination: {
        total,
        page:  Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getById(id) {
    const project = await Project.findById(id)
      .populate('members.member', 'name role avatar socials')
      .lean();
    if (!project) throw ApiError.notFound('Project');
    return project;
  }

  async create(data) {
    return Project.create(data);
  }

  async update(id, data) {
    const project = await Project.findByIdAndUpdate(id, data, {
      new: true, runValidators: true,
    }).lean();
    if (!project) throw ApiError.notFound('Project');
    return project;
  }

  async remove(id) {
    const project = await Project.findByIdAndDelete(id);
    if (!project) throw ApiError.notFound('Project');
    return project;
  }

  /**
   * Featured projects for the homepage highlights section.
   */
  async getFeatured(limit = 6) {
    return Project.find({ isFeatured: true, status: { $ne: 'archived' } })
      .sort({ order: 1 })
      .limit(limit)
      .select('title shortDescription techStack thumbnail links status category')
      .lean();
  }
}

module.exports = new ProjectService();
