'use server'

import { getPayloadClient } from '@/lib/data'

export type EnquiryState = {
  ok: boolean
  message: string
  errors?: Record<string, string>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitEnquiry(_prev: EnquiryState | null, formData: FormData): Promise<EnquiryState> {
  // honeypot: bots fill every field
  if (String(formData.get('company') || '').length > 0) {
    return { ok: true, message: 'Your enquiry has been received. Our team will get back to you shortly.' }
  }

  const firstName = String(formData.get('firstName') || '').trim()
  const lastName = String(formData.get('lastName') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const message = String(formData.get('message') || '').trim()
  const consent = formData.get('consent') === 'on'
  const propertyId = String(formData.get('propertyId') || '').trim()

  const errors: Record<string, string> = {}
  if (!firstName) errors.firstName = 'Please enter your first name.'
  if (!email || !EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  if (phone && !/^[+\d\s()-]{7,18}$/.test(phone)) errors.phone = 'Please enter a valid phone number.'
  if (!consent) errors.consent = 'Please accept the consent statement so we may contact you.'
  if (Object.keys(errors).length > 0) {
    return { ok: false, message: 'Please correct the highlighted fields.', errors }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'enquiries',
      data: {
        firstName,
        lastName: lastName || undefined,
        email,
        phone: phone || undefined,
        message: message || undefined,
        consent,
        property: propertyId ? Number(propertyId) || undefined : undefined,
      },
    })
    return { ok: true, message: 'Your enquiry has been received. Our team will get back to you shortly.' }
  } catch {
    return { ok: false, message: 'Something went wrong while sending your enquiry. Please try again, or reach us by phone or email.' }
  }
}
