import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  photo_url: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  batch: {
    type: String,
    required: true
  },
  isCore: {
    type: Boolean,
    default: false
  },
  hasAdminAccess: {
    type: Boolean,
    default: false
  },
  firebaseUid: {
    type: String,
    default: ''
  },
  adminEmail: {
    type: String,
    default: ''
  }
}, { timestamps: true })

export default mongoose.model('Member', memberSchema)