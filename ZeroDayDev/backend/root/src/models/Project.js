'use strict';

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String, required: true, trim: true, maxlength: 150,
    },
    description: {
      type: String, required: true, maxlength: 2000,
    },
    shortDescription: {
      type: String, maxlength: 300,   // used on cards
    },
    techStack: [{ type: String, trim: true }],
    category: {
      type: String,
      enum: ['web', 'mobile', 'ml', 'iot', 'tool', 'game', 'other'],
      default: 'web',
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'archived'],
      default: 'completed',
    },
    thumbnail: { type: String },          // URL
    images:    [{ type: String }],        // additional screenshots
    links: {
      github: { type: String },
      live:   { type: String },
      demo:   { type: String },
    },
    members: [
      {
        member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
        role:   { type: String },         // role in this specific project
      },
    ],
    startDate:   { type: Date },
    endDate:     { type: Date },
    isFeatured:  { type: Boolean, default: false },
    order:       { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

projectSchema.index({ isFeatured: 1, order: 1 });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ title: 'text', description: 'text', techStack: 'text' });

module.exports = mongoose.model('Project', projectSchema);
