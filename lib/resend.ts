import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = 'bsraghavan93@gmail.com'

export async function sendOrderNotification(order: {
  order_id: string
  customer_name: string
  customer_phone: string
  total: number
  payment_status: string
  items: any[]
}) {
  try {
    const itemsList = order.items
      .map(
        (item: any) =>
          `• ${item.product.name}${item.selectedSize ? ` (${item.selectedSize})` : ''}${item.selectedColor ? ` - ${item.selectedColor.name}` : ''} × ${item.quantity} = ₹${item.product.price * item.quantity}`
      )
      .join('\n')

    await resend.emails.send({
      from: 'TinyTrend Kids <orders@yourdomain.com>',
      to: ADMIN_EMAIL,
      subject: `New Order ${order.order_id} — ₹${order.total} (${order.payment_status})`,
      text: `New order received!\n\nOrder ID: ${order.order_id}\nCustomer: ${order.customer_name}\nPhone: ${order.customer_phone}\nPayment: ${order.payment_status}\nTotal: ₹${order.total}\n\nItems:\n${itemsList}`,
    })
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}
