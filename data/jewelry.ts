import { DemoStoreConfig } from '@/lib/demo-store-types'

const jewelryStore: DemoStoreConfig = {
  id: 'jewelry',
  name: 'Aadhya Jewels',
  tagline: 'Affordable Luxury, Timeless Beauty',
  description: 'Exquisite imitation jewelry for every occasion — weddings, festivals, and everyday elegance.',
  whatsappNumber: '917904072714',
  instagramHandle: '@aadhyajewels',
  email: 'orders@aadhyajewels.in',
  categories: [
    { id: 'earrings', name: 'Earrings', icon: '💎', count: 6 },
    { id: 'necksets', name: 'Necksets', icon: '📿', count: 5 },
    { id: 'bangles', name: 'Bangles', icon: '⭕', count: 4 },
    { id: 'anklets', name: 'Anklets', icon: '✨', count: 3 },
    { id: 'bridal', name: 'Bridal Collection', icon: '👰', count: 4 },
  ],
  products: [
    { id: 'j1', name: 'Kundan Jhumka Earrings – Gold', category: 'earrings', price: 599, originalPrice: 999, description: 'Traditional kundan jhumka earrings with pearl drops. Lightweight and comfortable for all-day wear.', image: '', badge: 'Bestseller', details: { Material: 'Alloy + Kundan', Plating: 'Gold Plated', Weight: '18g', Occasion: 'Wedding / Festive', Type: 'Jhumka' }, inStock: true },
    { id: 'j2', name: 'American Diamond Studs – Rose Gold', category: 'earrings', price: 449, originalPrice: 699, description: 'Sparkling AD stone studs in rose gold finish. Perfect for office and daily wear.', image: '', badge: 'Daily Wear', details: { Material: 'Brass + AD Stones', Plating: 'Rose Gold', Weight: '8g', Occasion: 'Daily / Office' }, inStock: true },
    { id: 'j3', name: 'Temple Earrings – Antique Gold', category: 'earrings', price: 749, description: 'South Indian style temple earrings with intricate goddess motif.', image: '', details: { Material: 'Alloy', Plating: 'Antique Gold', Style: 'Temple Jewelry', Weight: '22g' }, inStock: true },
    { id: 'j4', name: 'Choker Necklace Set – Pearl & Gold', category: 'necksets', price: 1299, originalPrice: 1999, description: 'Elegant pearl choker with matching earrings. Bridal favorite.', image: '', badge: 'Bridal Pick', details: { Material: 'Alloy + Pearl', Plating: '22K Gold', Set: 'Necklace + Earrings', Occasion: 'Wedding / Reception' }, inStock: true },
    { id: 'j5', name: 'Layered Necklace – Emerald Green', category: 'necksets', price: 899, originalPrice: 1299, description: 'Three-layer necklace with green stones. Statement piece for parties.', image: '', badge: 'Party Wear', details: { Material: 'Alloy + Crystal', Plating: 'Gold', Layers: '3', Occasion: 'Party / Festive' }, inStock: true },
    { id: 'j6', name: 'Mangalsutra – Modern Design', category: 'necksets', price: 799, description: 'Contemporary mangalsutra with AD pendant. Sleek and minimal.', image: '', details: { Material: 'Alloy + AD Stone', Plating: 'Gold + Black Beads', Length: '18 inches', Style: 'Modern' }, inStock: true },
    { id: 'j7', name: 'Silk Thread Bangles Set – Red & Gold', category: 'bangles', price: 399, originalPrice: 599, description: 'Handmade silk thread bangles set of 6. Vibrant colors with stone work.', image: '', badge: 'Handmade', variants: [{ label: 'Size', options: ['2.4', '2.6', '2.8', '2.10'] }], details: { Material: 'Silk Thread + Stone', Pieces: '6 Bangles', Type: 'Handmade' }, inStock: true },
    { id: 'j8', name: 'Kada Bangles – Antique Brass', category: 'bangles', price: 549, description: 'Broad antique brass kada with engraved patterns. Pair of 2.', image: '', variants: [{ label: 'Size', options: ['2.4', '2.6', '2.8'] }], details: { Material: 'Brass', Plating: 'Antique Finish', Pieces: '2' }, inStock: true },
    { id: 'j9', name: 'Ghungroo Anklet – Silver', category: 'anklets', price: 349, originalPrice: 499, description: 'Traditional ghungroo anklet with gentle sound. Pair of 2.', image: '', badge: 'Traditional', details: { Material: 'German Silver', Type: 'Ghungroo', Pieces: '2 (Pair)', Length: 'Adjustable' }, inStock: true },
    { id: 'j10', name: 'Bridal Maang Tikka – Gold & Pearl', category: 'bridal', price: 899, originalPrice: 1499, description: 'Stunning bridal maang tikka with pearl and kundan work.', image: '', badge: 'Bridal', details: { Material: 'Alloy + Kundan + Pearl', Plating: '22K Gold', Type: 'Maang Tikka', Occasion: 'Wedding' }, inStock: true },
    { id: 'j11', name: 'Bridal Necklace Set – Complete', category: 'bridal', price: 3499, originalPrice: 5999, description: 'Complete bridal set: necklace, earrings, tikka, and bangles. Grand wedding look.', image: '', badge: 'Premium Set', details: { Material: 'Alloy + Kundan + Pearl', Plating: '22K Gold', Set: 'Necklace + Earrings + Tikka + 2 Bangles', Occasion: 'Wedding' }, inStock: true },
    { id: 'j12', name: 'Oxidised Silver Necklace', category: 'necksets', price: 649, description: 'Boho style oxidised silver necklace. Great with kurtis and Indo-western.', image: '', details: { Material: 'German Silver', Finish: 'Oxidised', Style: 'Boho / Tribal', Length: '16 inches' }, inStock: true },
    { id: 'j13', name: 'CZ Diamond Ring – Solitaire Look', category: 'earrings', price: 299, originalPrice: 499, description: 'Cubic zirconia solitaire-look ring. Adjustable size.', image: '', badge: 'Under ₹300', details: { Material: 'Brass + CZ', Plating: 'Rhodium', Size: 'Adjustable' }, inStock: true },
    { id: 'j14', name: 'Bridal Haath Phool – Gold', category: 'bridal', price: 1199, description: 'Traditional hand harness with ring. Mehendi and haldi ceremony essential.', image: '', details: { Material: 'Alloy + Pearl', Plating: 'Gold', Type: 'Haath Phool', Occasion: 'Mehendi / Haldi' }, inStock: true },
    { id: 'j15', name: 'Stone Anklet – Rose Gold', category: 'anklets', price: 449, description: 'Delicate rose gold anklet with sparkling stones. Pair of 2.', image: '', details: { Material: 'Alloy + CZ', Plating: 'Rose Gold', Pieces: '2 (Pair)' }, inStock: true },
  ],
  testimonials: [
    { name: 'Neha Kapoor', location: 'Delhi', rating: 5, text: 'The bridal set was STUNNING. My relatives thought it was real gold! Amazing quality at this price.', avatar: 'NK' },
    { name: 'Divya Reddy', location: 'Hyderabad', rating: 5, text: 'I order from Aadhya regularly. The kundan earrings are my favorite — so lightweight!', avatar: 'DR' },
    { name: 'Swati Jain', location: 'Pune', rating: 4, text: 'Beautiful packaging and fast delivery. The choker set looks exactly like the photos.', avatar: 'SJ' },
    { name: 'Fatima Sheikh', location: 'Mumbai', rating: 5, text: 'Ordered silk thread bangles for my daughter\'s wedding. Everyone loved them!', avatar: 'FS' },
    { name: 'Rekha Menon', location: 'Kochi', rating: 5, text: 'Best imitation jewelry I\'ve found online. The oxidised collection is gorgeous.', avatar: 'RM' },
  ],
  orders: [
    { id: 'jo1', orderId: 'AJ-2001', customerName: 'Anita Desai', customerPhone: '9876543220', customerEmail: 'anita@email.com', address: '12 Park Street', city: 'Kolkata', items: [{ productId: 'j1', productName: 'Kundan Jhumka Earrings', quantity: 2, price: 599 }, { productId: 'j4', productName: 'Choker Necklace Set', quantity: 1, price: 1299 }], total: 2497, status: 'delivered', paymentMode: 'UPI', paymentStatus: 'paid', notes: '', createdAt: '2026-06-19T12:00:00Z' },
    { id: 'jo2', orderId: 'AJ-2002', customerName: 'Priyanka Nair', customerPhone: '9876543221', customerEmail: 'priyanka@email.com', address: '78 Brigade Road', city: 'Bangalore', items: [{ productId: 'j11', productName: 'Bridal Necklace Set – Complete', quantity: 1, price: 3499 }], total: 3499, status: 'confirmed', paymentMode: 'Bank Transfer', paymentStatus: 'paid', notes: 'Wedding on July 5th', createdAt: '2026-06-24T08:30:00Z' },
    { id: 'jo3', orderId: 'AJ-2003', customerName: 'Rashmi Gupta', customerPhone: '9876543222', customerEmail: 'rashmi@email.com', address: '45 Connaught Place', city: 'Delhi', items: [{ productId: 'j7', productName: 'Silk Thread Bangles Set', quantity: 3, price: 399, variant: 'Size: 2.6' }], total: 1197, status: 'new', paymentMode: 'COD', paymentStatus: 'unpaid', notes: 'Need all red & gold', createdAt: '2026-06-25T19:00:00Z' },
    { id: 'jo4', orderId: 'AJ-2004', customerName: 'Bhavna Shah', customerPhone: '9876543223', customerEmail: 'bhavna@email.com', address: '90 CG Road', city: 'Ahmedabad', items: [{ productId: 'j5', productName: 'Layered Necklace – Emerald', quantity: 1, price: 899 }, { productId: 'j2', productName: 'AD Studs – Rose Gold', quantity: 1, price: 449 }], total: 1348, status: 'shipped', paymentMode: 'UPI', paymentStatus: 'paid', notes: '', createdAt: '2026-06-21T15:30:00Z' },
  ],
}

export default jewelryStore
