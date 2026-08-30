'use client'

import { useActionState } from 'react'

import { submitEnquiry, type EnquiryState } from '@/lib/actions'

export function EnquiryForm({ consentText, propertyId }: { consentText: string; propertyId?: number }) {
  const [state, action, pending] = useActionState<EnquiryState | null, FormData>(submitEnquiry, null)

  if (state?.ok) {
    return (
      <div className="form-status ok" role="status">
        {state.message}
      </div>
    )
  }

  return (
    <form action={action} className="form-grid" noValidate>
      {propertyId ? <input type="hidden" name="propertyId" value={propertyId} /> : null}
      {/* honeypot */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-field">
        <label htmlFor="firstName">First name</label>
        <input id="firstName" name="firstName" type="text" autoComplete="given-name" required aria-invalid={Boolean(state?.errors?.firstName)} />
        {state?.errors?.firstName ? <span className="field-error">{state.errors.firstName}</span> : null}
      </div>
      <div className="form-field">
        <label htmlFor="lastName">Last name</label>
        <input id="lastName" name="lastName" type="text" autoComplete="family-name" />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(state?.errors?.email)} />
        {state?.errors?.email ? <span className="field-error">{state.errors.email}</span> : null}
      </div>
      <div className="form-field">
        <label htmlFor="phone">Phone number</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91" aria-invalid={Boolean(state?.errors?.phone)} />
        {state?.errors?.phone ? <span className="field-error">{state.errors.phone}</span> : null}
      </div>
      <div className="form-field full">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={5} placeholder="The locality, the budget, and what the space needs to do." />
      </div>
      <label className="form-consent">
        <input type="checkbox" name="consent" required aria-invalid={Boolean(state?.errors?.consent)} />
        <span>{consentText}</span>
      </label>
      {state && !state.ok ? (
        <div className="form-status err" role="alert">
          {state.message}
        </div>
      ) : null}
      <div className="form-field full" style={{ alignItems: 'flex-start' }}>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Sending…' : 'Send enquiry'}
        </button>
      </div>
    </form>
  )
}
