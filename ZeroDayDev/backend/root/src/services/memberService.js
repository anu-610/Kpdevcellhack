'use strict';

const Member    = require('../models/Member');
const { ApiError } = require('../utils/apiHelpers');

class MemberService {
  /**
   * Fetch all active core-team members, sorted by display order.
   */
  async getAll({ includeInactive = false } = {}) {
    const filter = includeInactive ? {} : { isActive: true };
    return Member.find(filter).sort({ order: 1, createdAt: 1 }).lean();
  }

  async getById(id) {
    const member = await Member.findById(id).lean();
    if (!member) throw ApiError.notFound('Member');
    return member;
  }

  async create(data) {
    return Member.create(data);
  }

  async update(id, data) {
    const member = await Member.findByIdAndUpdate(id, data, {
      new: true, runValidators: true,
    }).lean();
    if (!member) throw ApiError.notFound('Member');
    return member;
  }

  async remove(id) {
    const member = await Member.findByIdAndDelete(id);
    if (!member) throw ApiError.notFound('Member');
    return member;
  }

  /**
   * Returns a lightweight "highlights" summary used on the homepage.
   */
  async getHighlights() {
    const [totalMembers, coreTeam] = await Promise.all([
      Member.countDocuments({ isActive: true }),
      Member.find({ isActive: true, isCoreTeam: true })
        .sort({ order: 1 })
        .select('name role avatar socials year branch')
        .lean(),
    ]);
    return { totalMembers, coreTeam };
  }
}

module.exports = new MemberService();
