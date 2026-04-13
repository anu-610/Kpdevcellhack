import mongoose from 'mongoose'

const ANNOUNCEMENT_TTL_SECONDS = Number(process.env.ANNOUNCEMENT_TTL_SECONDS ?? 172800)

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

announcementSchema.index({ createdAt: 1 }, { expireAfterSeconds: ANNOUNCEMENT_TTL_SECONDS })

export default mongoose.model('Announcement', announcementSchema)