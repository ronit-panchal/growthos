import nodemailer from 'nodemailer'
import { render } from '@react-email/components'
import WelcomeEmail from '../../emails/welcome'
import InvoiceEmail from '../../emails/invoice'
import InviteEmail from '../../emails/invite'

type SendEmailArgs = {
  to: string
  subject: string
  html: string
}

function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP environment variables are not configured.')
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendEmail({ to, subject, html }: SendEmailArgs) {
  const transporter = createTransporter()
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'GrowthOS <no-reply@growthos.local>',
    to,
    subject,
    html,
  })
}

export async function sendWelcomeEmail(to: string, name: string) {
  const html = await render(WelcomeEmail({ name }))
  return sendEmail({ to, subject: 'Welcome to GrowthOS', html })
}

export async function sendInvoiceEmail(to: string, amountInr: number, invoiceId: string) {
  const html = await render(InvoiceEmail({ amountInr, invoiceId }))
  return sendEmail({ to, subject: 'Your GrowthOS invoice', html })
}

export async function sendInviteEmail(to: string, inviterName: string, inviteLink: string) {
  const html = await render(InviteEmail({ inviterName, inviteLink }))
  return sendEmail({ to, subject: 'You are invited to join GrowthOS', html })
}
