import express from 'express'
import admin from 'firebase-admin'
import Member from '../models/Member.js'
import verifyToken from '../middleware/auth.js'

const router = express.Router()

const generateEmail = (name) => {
  const cleaned = name.toLowerCase().replace(/\s+/g, '.')
  const random = Math.floor(1000 + Math.random() * 9000)
  return `${cleaned}.${random}@kpdevcell.admin`
}

const generatePassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

router.get('/', verifyToken, async (req, res) => {
  try {
    const members = await Member.find().select('name role batch photo_url firebaseUid hasAdminAccess adminEmail')
    res.json(members)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/give/:memberId', verifyToken, async (req, res) => {
  try {
    const member = await Member.findById(req.params.memberId)
    if (!member) return res.status(404).json({ message: 'Member not found' })
    if (member.hasAdminAccess) return res.status(400).json({ message: 'Member already has admin access' })

    const generatedEmail = generateEmail(member.name)
    const generatedPassword = generatePassword()

    const firebaseUser = await admin.auth().createUser({
      email: generatedEmail,
      password: generatedPassword,
      displayName: member.name
    })

    member.hasAdminAccess = true
    member.firebaseUid = firebaseUser.uid
    member.adminEmail = generatedEmail
    await member.save()

    // Return credentials to frontend
    res.json({
      message: `Admin access given to ${member.name}`,
      credentials: {
        email: generatedEmail,
        password: generatedPassword
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/remove/:memberId', verifyToken, async (req, res) => {
  try {
    const member = await Member.findById(req.params.memberId)
    if (!member) return res.status(404).json({ message: 'Member not found' })
    if (!member.hasAdminAccess) return res.status(400).json({ message: 'Member does not have admin access' })

    await admin.auth().deleteUser(member.firebaseUid)

    member.hasAdminAccess = false
    member.firebaseUid = ''
    member.adminEmail = ''
    await member.save()

    res.json({ message: `Admin access removed from ${member.name}` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router