'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormData {
  /* Step 1 */
  full_name: string
  business_name: string
  whatsapp_number: string
  email: string
  city_state: string
  instagram_url: string
  existing_website_url: string
  /* Step 2 */
  business_type: string
  business_description: string
  currently_takes_orders: string
  /* Step 3 */
  website_type: string
  needs_admin_access: string
  needs_customer_login: string
  needs_online_payment: string
  preferred_order_method: string
  /* Step 4 */
  initial_product_count: string
  product_update_frequency: string
  has_variants: string
  product_photos_ready: string
  expected_monthly_orders: string
  needs_image_storage: string
  /* Step 5 */
  style_preference: string
  brand_colors: string
  reference_links: string
  budget_range: string
  timeline: string
  additional_requirements: string
}

type Errors = Partial<Record<keyof FormData, string>>

const INITIAL: FormData = {
  full_name: '',
  business_name: '',
  whatsapp_number: '',
  email: '',
  city_state: '',
  instagram_url: '',
  existing_website_url: '',
  business_type: '',
  business_description: '',
  currently_takes_orders: '',
  website_type: '',
  needs_admin_access: '',
  needs_customer_login: '',
  needs_online_payment: '',
  preferred_order_method: '',
  initial_product_count: '',
  product_update_frequency: '',
  has_variants: '',
  product_photos_ready: '',
  expected_monthly_orders: '',
  needs_image_storage: '',
  style_preference: '',
  brand_colors: '',
  reference_links: '',
  budget_range: '',
  timeline: '',
  additional_requirements: '',
}

const STEPS = [
  'Contact Details',
  'About Your Business',
  'Website Requirements',
  'Catalog & Operations',
  'Design & Budget',
]

/* ------------------------------------------------------------------ */
/*  Reusable UI Helpers                                                */
/* ------------------------------------------------------------------ */

function Label({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return <label className="block text-sm font-medium text-gray-300 mb-1.5">{children}</label>
}

function ErrorText({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="text-red-400 text-xs mt-1">{msg}</p>
}

function InputField({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  required,
}: {
  label: string
  name: keyof FormData
  value: string
  onChange: (n: keyof FormData, v: string) => void
  error?: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white/[0.06] border ${error ? 'border-red-400/60' : 'border-white/[0.1]'} rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all`}
      />
      <ErrorText msg={error} />
    </div>
  )
}

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string
  name: keyof FormData
  value: string
  onChange: (n: keyof FormData, v: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <textarea
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none"
      />
    </div>
  )
}

function PillGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required,
}: {
  label: string
  name: keyof FormData
  options: string[]
  value: string
  onChange: (n: keyof FormData, v: string) => void
  error?: string
  required?: boolean
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(name, opt)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
              value === opt
                ? 'bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 border-violet-400/50 text-white shadow-lg shadow-violet-500/10'
                : 'bg-white/[0.04] border-white/[0.1] text-gray-400 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.2]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <ErrorText msg={error} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

function validateStep(step: number, data: FormData): Errors {
  const err: Errors = {}

  if (step === 1) {
    if (!data.full_name.trim()) err.full_name = 'Full name is required'
    if (!data.business_name.trim()) err.business_name = 'Business name is required'
    const digits = data.whatsapp_number.replace(/\D/g, '')
    if (!digits) err.whatsapp_number = 'WhatsApp number is required'
    else if (digits.length < 10) err.whatsapp_number = 'Enter at least 10 digits'
    const ig = data.instagram_url.trim()
    if (!ig) err.instagram_url = 'Instagram URL or handle is required'
    else if (!ig.includes('instagram.com') && !ig.startsWith('@'))
      err.instagram_url = 'Enter a valid Instagram URL or @handle'
  }

  if (step === 2) {
    if (!data.business_type) err.business_type = 'Please select your business type'
    if (!data.currently_takes_orders) err.currently_takes_orders = 'Please select an option'
  }

  if (step === 3) {
    if (!data.website_type) err.website_type = 'Please select a website type'
    if (!data.needs_admin_access) err.needs_admin_access = 'Please select an option'
    if (!data.needs_online_payment) err.needs_online_payment = 'Please select an option'
  }

  if (step === 4) {
    if (!data.initial_product_count) err.initial_product_count = 'Please select a range'
    if (!data.has_variants) err.has_variants = 'Please select an option'
    if (!data.product_photos_ready) err.product_photos_ready = 'Please select an option'
  }

  if (step === 5) {
    if (!data.style_preference) err.style_preference = 'Please select a style'
  }

  return err
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function GetQuotePage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const set = (name: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [name]: value }))
    setErrors((p) => {
      const next = { ...p }
      delete next[name]
      return next
    })
  }

  const next = () => {
    const errs = validateStep(step, form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setStep((s) => Math.min(s + 1, 5))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const back = () => {
    setErrors({})
    setStep((s) => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async () => {
    const errs = validateStep(5, form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setSubmitting(true)
    setSubmitError('')

    try {
      const { error } = await supabase.from('website_enquiries').insert([
        {
          ...form,
          status: 'new',
          created_at: new Date().toISOString(),
        },
      ])
      if (error) {
        console.error('Supabase insert error:', error)
        setSubmitError('Something went wrong. Please try again or contact us on WhatsApp.')
      } else {
        setSubmitted(true)
      }
    } catch (e) {
      console.error('Submission error:', e)
      setSubmitError('Something went wrong. Please try again or contact us on WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ---- Success Screen ---- */
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0d1a] text-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/25">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Thank You!</h1>
          <p className="text-gray-400 text-lg mb-2">We received your enquiry.</p>
          <p className="text-gray-500 mb-8">
            We&apos;ll review your details and contact you soon on WhatsApp or phone.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold px-8 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  /* ---- Main Form ---- */
  return (
    <div className="min-h-screen bg-[#0a0d1a] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0a0d1a]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-violet-600/[0.07] to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-fuchsia-600/[0.05] to-transparent rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0c0f1a]/60 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xs">PC</span>
            </div>
            <span className="font-heading font-bold text-lg">
              Pixel<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Craft</span> Studios
            </span>
          </Link>
          <span className="text-xs text-gray-500 hidden sm:inline">Website Enquiry</span>
        </div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-lg font-semibold text-white">
              Step {step} of 5
            </h2>
            <span className="text-xs text-gray-500">{STEPS[step - 1]}</span>
          </div>
          <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 md:p-10">
          {/* ---------- STEP 1 ---------- */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl md:text-2xl font-bold mb-1">
                  <span className="mr-2">&#128100;</span>Step 1: Contact Details
                </h3>
                <p className="text-sm text-gray-500">Let us know how to reach you.</p>
              </div>

              <InputField label="Full Name" name="full_name" value={form.full_name} onChange={set} error={errors.full_name} required />
              <InputField label="Business Name" name="business_name" value={form.business_name} onChange={set} error={errors.business_name} required />
              <InputField label="WhatsApp Number" name="whatsapp_number" value={form.whatsapp_number} onChange={set} error={errors.whatsapp_number} placeholder="+91 98765 43210" required />
              <InputField label="Email" name="email" value={form.email} onChange={set} type="email" placeholder="you@example.com" />
              <InputField label="City / State" name="city_state" value={form.city_state} onChange={set} placeholder="e.g. Chennai, Tamil Nadu" />
              <InputField label="Instagram URL or @handle" name="instagram_url" value={form.instagram_url} onChange={set} error={errors.instagram_url} placeholder="@yourbrand or instagram.com/yourbrand" required />
              <InputField label="Existing Website URL (if any)" name="existing_website_url" value={form.existing_website_url} onChange={set} placeholder="https://..." />
            </div>
          )}

          {/* ---------- STEP 2 ---------- */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl md:text-2xl font-bold mb-1">
                  <span className="mr-2">&#127978;</span>Step 2: About Your Business
                </h3>
                <p className="text-sm text-gray-500">Help us understand what you sell.</p>
              </div>

              <PillGroup
                label="Business Type"
                name="business_type"
                options={['Clothing / Boutique', 'Kids Wear', 'Jewelry', 'Bakery / Homemade Food', 'Skincare / Beauty', 'Gifts / Handmade Products', 'Home Decor', 'Other']}
                value={form.business_type}
                onChange={set}
                error={errors.business_type}
                required
              />

              <TextArea
                label="Business Description"
                name="business_description"
                value={form.business_description}
                onChange={set}
                placeholder="Tell us briefly about your business..."
              />

              <PillGroup
                label="Do you currently take orders through Instagram/WhatsApp?"
                name="currently_takes_orders"
                options={['Yes', 'No']}
                value={form.currently_takes_orders}
                onChange={set}
                error={errors.currently_takes_orders}
                required
              />
            </div>
          )}

          {/* ---------- STEP 3 ---------- */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl md:text-2xl font-bold mb-1">
                  <span className="mr-2">&#128187;</span>Step 3: Website Requirements
                </h3>
                <p className="text-sm text-gray-500">What kind of website do you need?</p>
              </div>

              <PillGroup
                label="Website Type"
                name="website_type"
                options={['Product catalog only', 'Catalog with WhatsApp ordering', 'Full online store with cart', 'Online payment integration', 'Not sure, need guidance']}
                value={form.website_type}
                onChange={set}
                error={errors.website_type}
                required
              />

              <PillGroup
                label="Do you need admin access to manage products?"
                name="needs_admin_access"
                options={['Yes', 'No', 'Not sure']}
                value={form.needs_admin_access}
                onChange={set}
                error={errors.needs_admin_access}
                required
              />

              <PillGroup
                label="Do customers need login/accounts?"
                name="needs_customer_login"
                options={['Yes', 'No', 'Not sure']}
                value={form.needs_customer_login}
                onChange={set}
              />

              <PillGroup
                label="Do you need online payment integration?"
                name="needs_online_payment"
                options={['Yes', 'No', 'Not sure']}
                value={form.needs_online_payment}
                onChange={set}
                error={errors.needs_online_payment}
                required
              />

              <PillGroup
                label="Preferred order method"
                name="preferred_order_method"
                options={['WhatsApp', 'Website cart', 'Phone call', 'Instagram DM', 'Not sure']}
                value={form.preferred_order_method}
                onChange={set}
              />
            </div>
          )}

          {/* ---------- STEP 4 ---------- */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl md:text-2xl font-bold mb-1">
                  <span className="mr-2">&#128230;</span>Step 4: Catalog & Operations
                </h3>
                <p className="text-sm text-gray-500">Tell us about your products and operations.</p>
              </div>

              <PillGroup
                label="How many products will you start with?"
                name="initial_product_count"
                options={['1–25', '26–50', '51–100', '101–250', '250+']}
                value={form.initial_product_count}
                onChange={set}
                error={errors.initial_product_count}
                required
              />

              <PillGroup
                label="How often do you update your products?"
                name="product_update_frequency"
                options={['Rarely', 'Weekly', 'Monthly', 'Seasonally']}
                value={form.product_update_frequency}
                onChange={set}
              />

              <PillGroup
                label="Do your products have size/color variants?"
                name="has_variants"
                options={['Yes', 'No', 'Some products']}
                value={form.has_variants}
                onChange={set}
                error={errors.has_variants}
                required
              />

              <PillGroup
                label="Are product photos ready?"
                name="product_photos_ready"
                options={['Yes', 'No', 'Partially']}
                value={form.product_photos_ready}
                onChange={set}
                error={errors.product_photos_ready}
                required
              />

              <PillGroup
                label="Expected monthly orders"
                name="expected_monthly_orders"
                options={['0–25', '26–100', '101–500', '500+']}
                value={form.expected_monthly_orders}
                onChange={set}
              />

              <PillGroup
                label="Do you need image storage/hosting?"
                name="needs_image_storage"
                options={['Yes', 'No', 'Not sure']}
                value={form.needs_image_storage}
                onChange={set}
              />
            </div>
          )}

          {/* ---------- STEP 5 ---------- */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl md:text-2xl font-bold mb-1">
                  <span className="mr-2">&#127912;</span>Step 5: Design & Budget
                </h3>
                <p className="text-sm text-gray-500">Almost done! Just a few more preferences.</p>
              </div>

              <PillGroup
                label="Style Preference"
                name="style_preference"
                options={['Simple and clean', 'Premium/luxury', 'Cute/playful', 'Traditional/ethnic', 'Modern/minimal', 'Colorful/Instagram-style', 'Not sure']}
                value={form.style_preference}
                onChange={set}
                error={errors.style_preference}
                required
              />

              <InputField
                label="Brand Colors"
                name="brand_colors"
                value={form.brand_colors}
                onChange={set}
                placeholder="e.g. Pink & Gold, Red & Black"
              />

              <TextArea
                label="Reference Links"
                name="reference_links"
                value={form.reference_links}
                onChange={set}
                placeholder="Share any websites or Instagram pages you like..."
              />

              <div>
                <p className="text-white font-semibold text-lg mb-1">One size fits all? We don&apos;t believe it.</p>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Is there a price range you&apos;d be comfortable investing in? <span className="text-gray-500">(Optional)</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">This helps us recommend the right features without suggesting more than you need. Leave blank if you&apos;d prefer us to recommend the best option first.</p>
                <InputField
                  label=""
                  name="budget_range"
                  value={form.budget_range}
                  onChange={set}
                  placeholder="Example: ₹8,000–₹12,000"
                />
              </div>

              <PillGroup
                label="Timeline"
                name="timeline"
                options={['Within 3 days', 'Within 1 week', 'Within 2 weeks', 'Flexible']}
                value={form.timeline}
                onChange={set}
              />

              <TextArea
                label="Additional Requirements"
                name="additional_requirements"
                value={form.additional_requirements}
                onChange={set}
                placeholder="Anything else you'd like us to know..."
              />

              {submitError && (
                <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 text-red-300 text-sm">
                  {submitError}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.06]">
            {step > 1 ? (
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-medium text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold px-8 py-3 rounded-full text-sm transition-all hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5"
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-full text-sm transition-all hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Enquiry
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Your information is secure and will only be used to prepare your quote.
        </p>
      </div>
    </div>
  )
}
