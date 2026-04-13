'use strict';

const Joi = require('joi');

// ─── reusable pieces ────────────────────────────────────────────────────────
const objectId = Joi.string().hex().length(24).messages({
  'string.length': 'Must be a valid MongoDB ObjectId',
});

const urlOptional = Joi.string().uri().optional().allow('', null);

// ─── Members ─────────────────────────────────────────────────────────────────
const memberCreate = Joi.object({
  name:       Joi.string().trim().max(100).required(),
  role:       Joi.string().trim().required(),
  year:       Joi.string().valid('1st', '2nd', '3rd', '4th', 'Alumni').required(),
  branch:     Joi.string().trim().optional(),
  bio:        Joi.string().max(500).optional(),
  avatar:     urlOptional,
  socials:    Joi.object({
    github:   urlOptional,
    linkedin: urlOptional,
    twitter:  urlOptional,
  }).optional(),
  skills:     Joi.array().items(Joi.string().trim()).optional(),
  isActive:   Joi.boolean().optional(),
  isCoreTeam: Joi.boolean().optional(),
  order:      Joi.number().integer().optional(),
});

const memberUpdate = memberCreate.fork(
  ['name', 'role', 'year'],
  (schema) => schema.optional()
);

// ─── Projects ─────────────────────────────────────────────────────────────────
const projectCreate = Joi.object({
  title:            Joi.string().trim().max(150).required(),
  description:      Joi.string().max(2000).required(),
  shortDescription: Joi.string().max(300).optional(),
  techStack:        Joi.array().items(Joi.string().trim()).optional(),
  category:         Joi.string().valid('web','mobile','ml','iot','tool','game','other').optional(),
  status:           Joi.string().valid('ongoing','completed','archived').optional(),
  thumbnail:        urlOptional,
  images:           Joi.array().items(Joi.string().uri()).optional(),
  links: Joi.object({
    github: urlOptional,
    live:   urlOptional,
    demo:   urlOptional,
  }).optional(),
  members: Joi.array().items(
    Joi.object({ member: objectId.required(), role: Joi.string().optional() })
  ).optional(),
  startDate:  Joi.date().iso().optional(),
  endDate:    Joi.date().iso().optional(),
  isFeatured: Joi.boolean().optional(),
  order:      Joi.number().integer().optional(),
});

const projectUpdate = projectCreate.fork(
  ['title', 'description'],
  (schema) => schema.optional()
);

// ─── Chat ──────────────────────────────────────────────────────────────────
const chatHistoryQuery = Joi.object({
  before: Joi.date().iso().optional(),   // cursor for pagination
  limit:  Joi.number().integer().min(1).max(100).default(50),
});

module.exports = {
  memberCreate,
  memberUpdate,
  projectCreate,
  projectUpdate,
  chatHistoryQuery,
  objectId,
};
