import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { sendOrderNotification } from '@/lib/resend'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({
      order_id: body.order_id,
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_email: body.customer_email || null,
      address: body.address,
      city: body.city || null,
      notes: body.notes || null,
      items: body.items,
      total: body.total,
      status: 'pending',
      payment_status: body.payment_status || 'unpaid',
      upi_ref: body.upi_ref || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  sendOrderNotification({
    order_id: body.order_id,
    customer_name: body.customer_name,
    customer_phone: body.customer_phone,
    total: body.total,
    payment_status: body.payment_status,
    items: body.items,
  }).catch(console.error)

  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { id, ...updates } = body

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
