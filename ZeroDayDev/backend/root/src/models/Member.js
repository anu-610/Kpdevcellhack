'use strict';

const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String, required: true, trim: true, maxlength: 100,
    },
    role: {
      type: String, required: true, trim: true,
      // e.g. "Lead Developer", "UI/UX Designer"
    },
    year: {
      type: String,
      enum: ['1st', '2nd', '3rd', '4th', 'Alumni'],
      required: true,
    },
    branch: { type: String, trim: true },    // e.g. "CSE", "ECE"
    bio:    { type: String, maxlength: 500 },
    avatar: { type: String },                 // URL or relative path
    socials: {
      github:   { type: String },
      linkedin: { type: String },
      twitter:  { type: String },
    },
    skills:    [{ type: String, trim: true }],
    isActive:  { type: Boolean, default: true },
    isCoreTeam: { type: Boolean, default: true },
    order:     { type: Number, default: 0 },  // display order
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

memberSchema.index({ isActive: 1, order: 1 });
memberSchema.index({ name: 'text', role: 'text', skills: 'text' });

module.exports = mongoose.model('Member', memberSchema, 'Core members');
