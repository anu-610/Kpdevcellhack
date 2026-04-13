import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendAdminInvite = async ({ toEmail, name, generatedEmail, generatedPassword }) => {
  console.log('📧 Attempting to send via Resend to:', toEmail)
  console.log('📧 API key set:', !!process.env.RESEND_API_KEY)
  console.log('📧 API key starts with re_:', process.env.RESEND_API_KEY?.startsWith('re_'))

  const result = await resend.emails.send({
    from: 'KP Dev Cell <onboarding@resend.dev>',
    to: toEmail,
    subject: '🔐 Admin Access Granted — KP Dev Cell',
    html: `<p>Test email for <b>${name}</b></p>`
  })

  console.log('✅ Resend result:', JSON.stringify(result, null, 2))

  if (result.error) {
    throw new Error(result.error.message || JSON.stringify(result.error))
  }
}

export default sendAdminInvite