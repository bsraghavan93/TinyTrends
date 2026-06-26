import { DemoStoreConfig } from '@/lib/demo-store-types'

const boutiqueStore: DemoStoreConfig = {
  id: 'boutique',
  name: 'Varnika Boutique',
  tagline: 'Elegance in Every Thread',
  description: 'Curated collection of sarees, kurtis, and ethnic wear for the modern Indian woman.',
  whatsappNumber: '917904072714',
  instagramHandle: '@varnikaboutique',
  email: 'hello@varnikaboutique.in',
  categories: [
    { id: 'sarees', name: 'Sarees', icon: '🥻', count: 8 },
    { id: 'kurtis', name: 'Kurtis', icon: '👘', count: 6 },
    { id: 'dress-materials', name: 'Dress Materials', icon: '🧵', count: 5 },
    { id: 'party-wear', name: 'Party Wear', icon: '✨', count: 4 },
    { id: 'new-arrivals', name: 'New Arrivals', icon: '🆕', count: 6 },
  ],
  products: [
    { id: 'b1', name: 'Banarasi Silk Saree – Royal Blue', category: 'sarees', price: 3499, originalPrice: 5999, description: 'Pure Banarasi silk with intricate golden zari work. Perfect for weddings and festivals.', image: '', badge: 'Bestseller', variants: [{ label: 'Blouse Size', options: ['32', '34', '36', '38', '40'] }], details: { Fabric: 'Pure Silk', Length: '6.3 meters', Blouse: 'Unstitched 0.8m', Work: 'Zari Weaving', Occasion: 'Wedding / Festive' }, inStock: true },
    { id: 'b2', name: 'Chanderi Cotton Saree – Peach', category: 'sarees', price: 1899, originalPrice: 2499, description: 'Lightweight Chanderi cotton saree with delicate print, ideal for daily and office wear.', image: '', badge: 'New', variants: [{ label: 'Blouse Size', options: ['32', '34', '36', '38', '40'] }], details: { Fabric: 'Chanderi Cotton', Length: '6.3 meters', Blouse: 'Unstitched 0.8m', Occasion: 'Casual / Office' }, inStock: true },
    { id: 'b3', name: 'Organza Floral Saree – Lavender', category: 'sarees', price: 2799, originalPrice: 3999, description: 'Beautiful organza saree with digital floral prints and satin border.', image: '', variants: [{ label: 'Blouse Size', options: ['32', '34', '36', '38', '40'] }], details: { Fabric: 'Organza', Length: '6.3 meters', Work: 'Digital Print', Occasion: 'Party / Festive' }, inStock: true },
    { id: 'b4', name: 'Anarkali Kurti – Maroon', category: 'kurtis', price: 1299, originalPrice: 1799, description: 'Flared Anarkali kurti with golden embroidery on neckline. Paired perfectly with palazzo.', image: '', badge: 'Trending', variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }], details: { Fabric: 'Rayon', Length: 'Below Knee', Style: 'Anarkali', Occasion: 'Festive / Casual' }, inStock: true },
    { id: 'b5', name: 'Straight Kurti – Teal Block Print', category: 'kurtis', price: 899, originalPrice: 1299, description: 'Hand block printed straight kurti in pure cotton. Breathable and stylish.', image: '', variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }], details: { Fabric: 'Pure Cotton', Length: 'Calf Length', Work: 'Block Print', Occasion: 'Daily / Office' }, inStock: true },
    { id: 'b6', name: 'A-Line Kurti – Mustard Embroidered', category: 'kurtis', price: 1099, description: 'Elegant A-line kurti with thread embroidery on yoke.', image: '', variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }], details: { Fabric: 'Cotton Blend', Style: 'A-Line', Work: 'Thread Embroidery' }, inStock: true },
    { id: 'b7', name: 'Unstitched Suit – Pastel Pink', category: 'dress-materials', price: 1599, originalPrice: 2199, description: '3-piece unstitched suit with dupatta. Chiffon fabric with embroidered work.', image: '', details: { Fabric: 'Chiffon + Cotton', Pieces: '3 (Top + Bottom + Dupatta)', Work: 'Machine Embroidery' }, inStock: true },
    { id: 'b8', name: 'Printed Lawn Suit – Blue', category: 'dress-materials', price: 999, description: 'Lightweight printed lawn cotton suit material for summer.', image: '', details: { Fabric: 'Lawn Cotton', Pieces: '3', Occasion: 'Casual / Daily' }, inStock: true },
    { id: 'b9', name: 'Georgette Gown – Emerald Green', category: 'party-wear', price: 4999, originalPrice: 7499, description: 'Floor-length georgette gown with sequin work. Red carpet ready.', image: '', badge: 'Premium', variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL'] }], details: { Fabric: 'Georgette', Length: 'Floor Length', Work: 'Sequin + Beadwork', Occasion: 'Wedding / Party' }, inStock: true },
    { id: 'b10', name: 'Sharara Set – Dusty Rose', category: 'party-wear', price: 3299, originalPrice: 4499, description: 'Stunning sharara set with embroidered kurta. Perfect for mehendi and sangeet.', image: '', badge: 'New Arrival', variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL'] }], details: { Fabric: 'Chinon', Style: 'Sharara Set', Work: 'Embroidery', Occasion: 'Festive / Party' }, inStock: true },
    { id: 'b11', name: 'Linen Saree – Olive Green', category: 'new-arrivals', price: 2199, description: 'Premium linen saree with temple border. Comfortable and classy.', image: '', badge: 'Just In', variants: [{ label: 'Blouse Size', options: ['32', '34', '36', '38', '40'] }], details: { Fabric: 'Pure Linen', Length: '6.3 meters', Border: 'Temple Border' }, inStock: true },
    { id: 'b12', name: 'Co-ord Set – Lavender', category: 'new-arrivals', price: 1499, description: 'Trendy co-ord set with crop top and wide-leg pants.', image: '', badge: 'New', variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL'] }], details: { Fabric: 'Crepe', Style: 'Co-ord Set', Occasion: 'Casual / Brunch' }, inStock: true },
    { id: 'b13', name: 'Palazzo Kurti Set – Navy Blue', category: 'kurtis', price: 1699, originalPrice: 2199, description: 'Elegant kurti with matching palazzo and dupatta. Complete festive look.', image: '', variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }], details: { Fabric: 'Rayon', Style: 'Kurti Set', Pieces: '3' }, inStock: true },
    { id: 'b14', name: 'Silk Blend Saree – Magenta', category: 'sarees', price: 2499, description: 'Rich silk blend saree with contrast pallu. Great for pooja and functions.', image: '', variants: [{ label: 'Blouse Size', options: ['32', '34', '36', '38', '40'] }], details: { Fabric: 'Silk Blend', Length: '6.3 meters', Work: 'Woven' }, inStock: true },
    { id: 'b15', name: 'Jacket Style Kurti – Wine', category: 'new-arrivals', price: 1399, description: 'Double-layered jacket style kurti in wine shade with gold buttons.', image: '', badge: 'Trending', variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL'] }], details: { Fabric: 'Cotton Silk', Style: 'Jacket Kurti' }, inStock: true },
  ],
  testimonials: [
    { name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'Bought a Banarasi saree for my wedding — absolutely gorgeous! The quality is unbeatable at this price.', avatar: 'PS' },
    { name: 'Anjali Mehta', location: 'Delhi', rating: 5, text: 'Love the kurtis! I ordered 3 and each one fits perfectly. Great fabric quality.', avatar: 'AM' },
    { name: 'Deepika R.', location: 'Bangalore', rating: 4, text: 'Beautiful dress materials. The embroidery work is so neat. Will order again for sure.', avatar: 'DR' },
    { name: 'Sneha Patel', location: 'Ahmedabad', rating: 5, text: 'The sharara set I got for my sister\'s sangeet was a showstopper! Everyone asked where I got it.', avatar: 'SP' },
    { name: 'Kavitha N.', location: 'Chennai', rating: 5, text: 'Best online boutique! The linen sarees are so comfortable. Perfect for office wear.', avatar: 'KN' },
  ],
  orders: [
    { id: 'bo1', orderId: 'VB-1001', customerName: 'Meera Joshi', customerPhone: '9876543210', customerEmail: 'meera@email.com', address: '42 MG Road, Koramangala', city: 'Bangalore', items: [{ productId: 'b1', productName: 'Banarasi Silk Saree – Royal Blue', quantity: 1, price: 3499, variant: 'Blouse: 36' }], total: 3499, status: 'delivered', paymentMode: 'UPI', paymentStatus: 'paid', notes: '', createdAt: '2026-06-20T10:30:00Z' },
    { id: 'bo2', orderId: 'VB-1002', customerName: 'Ritu Agarwal', customerPhone: '9876543211', customerEmail: 'ritu@email.com', address: '15 Linking Road', city: 'Mumbai', items: [{ productId: 'b4', productName: 'Anarkali Kurti – Maroon', quantity: 2, price: 1299, variant: 'Size: L' }, { productId: 'b5', productName: 'Straight Kurti – Teal Block Print', quantity: 1, price: 899, variant: 'Size: M' }], total: 3497, status: 'shipped', paymentMode: 'COD', paymentStatus: 'unpaid', notes: 'Please gift wrap', createdAt: '2026-06-22T14:15:00Z' },
    { id: 'bo3', orderId: 'VB-1003', customerName: 'Lakshmi Iyer', customerPhone: '9876543212', customerEmail: 'lakshmi@email.com', address: '88 Anna Nagar', city: 'Chennai', items: [{ productId: 'b9', productName: 'Georgette Gown – Emerald Green', quantity: 1, price: 4999, variant: 'Size: M' }], total: 4999, status: 'confirmed', paymentMode: 'UPI', paymentStatus: 'paid', notes: 'Urgent - need by 28th', createdAt: '2026-06-24T09:00:00Z' },
    { id: 'bo4', orderId: 'VB-1004', customerName: 'Sunita Verma', customerPhone: '9876543213', customerEmail: 'sunita@email.com', address: '23 Civil Lines', city: 'Jaipur', items: [{ productId: 'b11', productName: 'Linen Saree – Olive Green', quantity: 1, price: 2199 }], total: 2199, status: 'new', paymentMode: 'COD', paymentStatus: 'unpaid', notes: '', createdAt: '2026-06-25T16:45:00Z' },
    { id: 'bo5', orderId: 'VB-1005', customerName: 'Pooja Singh', customerPhone: '9876543214', customerEmail: 'pooja@email.com', address: '56 Sector 18', city: 'Noida', items: [{ productId: 'b10', productName: 'Sharara Set – Dusty Rose', quantity: 1, price: 3299, variant: 'Size: S' }, { productId: 'b12', productName: 'Co-ord Set – Lavender', quantity: 1, price: 1499, variant: 'Size: S' }], total: 4798, status: 'packed', paymentMode: 'Bank Transfer', paymentStatus: 'paid', notes: '', createdAt: '2026-06-23T11:20:00Z' },
  ],
}

export default boutiqueStore
