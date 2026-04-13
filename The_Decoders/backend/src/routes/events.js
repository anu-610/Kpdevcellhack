import express from 'express'
import Event from '../models/Event.js'
import verifyToken from '../middleware/auth.js'

const router = express.Router()

const getEventTypeFromDate = (dateValue) => {
  const eventDate = new Date(dateValue)
  if (Number.isNaN(eventDate.getTime())) {
    throw new Error('Invalid event date')
  }

  const today = new Date()
  const eventDay = eventDate.toISOString().slice(0, 10)
  const todayDay = today.toISOString().slice(0, 10)

  if (eventDay === todayDay) return 'today'
  return eventDay > todayDay ? 'upcoming' : 'past'
}

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 })
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET upcoming events only
router.get('/upcoming', async (req, res) => {
  try {
    const events = await Event.find({ type: 'upcoming' }).sort({ date: 1 })
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST create event (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      type: getEventTypeFromDate(req.body.date)
    }
    const event = new Event(payload)
    const saved = await event.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT update event (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      type: getEventTypeFromDate(req.body.date)
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE event (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    res.json({ message: 'Event deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router