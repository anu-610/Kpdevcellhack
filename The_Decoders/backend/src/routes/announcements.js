import express from 'express'
import Announcement from '../models/Announcement.js'
import verifyToken from '../middleware/auth.js'

const router = express.Router()
const ANNOUNCEMENT_TTL_SECONDS = Number(process.env.ANNOUNCEMENT_TTL_SECONDS ?? 172800)
const ANNOUNCEMENT_TTL_MS = ANNOUNCEMENT_TTL_SECONDS * 1000

function getAnnouncementCutoff() {
  return new Date(Date.now() - ANNOUNCEMENT_TTL_MS)
}

router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({
      active: true,
      createdAt: { $gte: getAnnouncementCutoff() },
    }).sort({ createdAt: -1 })
    res.json(announcements)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', verifyToken, async (req, res) => {
  try {
    const announcement = new Announcement(req.body)
    const saved = await announcement.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id)
    res.json({ message: 'Announcement deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET all announcements including inactive (admin only)
router.get('/all', verifyToken, async (req, res) => {
  try {
    const announcements = await Announcement.find({
      createdAt: { $gte: getAnnouncementCutoff() },
    }).sort({ createdAt: -1 })
    res.json(announcements)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router