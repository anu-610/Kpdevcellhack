import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['upcoming', 'past', 'today'],
    required: true
  },
  image_url: {
    type: String,
    default: ''
  }
}, { timestamps: true })

export default mongoose.model('Event', eventSchema)