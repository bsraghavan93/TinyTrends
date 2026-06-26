import { DemoStoreConfig } from '@/lib/demo-store-types'

const skincareStore: DemoStoreConfig = {
  id: 'skincare',
  name: 'Nila Naturals',
  tagline: 'Pure Ingredients, Happy Skin',
  description: 'Handmade soaps, body butter, lip balms and face packs — crafted with love using natural ingredients.',
  whatsappNumber: '917904072714',
  instagramHandle: '@nilanaturals',
  email: 'care@nilanaturals.in',
  categories: [
    { id: 'soaps', name: 'Handmade Soaps', icon: '🧼', count: 5 },
    { id: 'body-butter', name: 'Body Butter', icon: '🫧', count: 4 },
    { id: 'lip-balms', name: 'Lip Balms', icon: '💋', count: 3 },
    { id: 'face-packs', name: 'Face Packs', icon: '🌿', count: 4 },
    { id: 'gift-combos', name: 'Gift Combos', icon: '🎁', count: 4 },
  ],
  products: [
    { id: 'sk1', name: 'Charcoal Detox Soap Bar', category: 'soaps', price: 249, originalPrice: 349, description: 'Activated charcoal with tea tree oil. Deep cleanses pores and removes impurities.', image: '', badge: 'Bestseller', details: { Weight: '100g', 'Key Ingredients': 'Activated Charcoal, Tea Tree Oil, Coconut Oil', 'Skin Type': 'Oily / Combination', 'Shelf Life': '12 months', 'Free From': 'SLS, Parabens, Artificial Colors' }, inStock: true },
    { id: 'sk2', name: 'Rose & Goat Milk Soap', category: 'soaps', price: 299, description: 'Gentle rose-scented soap with goat milk. Nourishes and moisturizes dry skin.', image: '', badge: 'Gentle', details: { Weight: '100g', 'Key Ingredients': 'Rose Petals, Goat Milk, Shea Butter', 'Skin Type': 'Dry / Sensitive', 'Free From': 'SLS, Parabens' }, inStock: true },
    { id: 'sk3', name: 'Turmeric & Saffron Glow Soap', category: 'soaps', price: 349, description: 'Traditional haldi-kesar formula for bright, even-toned skin.', image: '', badge: 'Glow', details: { Weight: '100g', 'Key Ingredients': 'Turmeric, Saffron, Almond Oil', 'Skin Type': 'All Skin Types', Benefit: 'Brightening' }, inStock: true },
    { id: 'sk4', name: 'Lavender Calm Soap', category: 'soaps', price: 279, description: 'Relaxing lavender soap for a calming bathing experience. Handmade with essential oils.', image: '', details: { Weight: '100g', 'Key Ingredients': 'Lavender Essential Oil, Olive Oil', 'Skin Type': 'All Skin Types' }, inStock: true },
    { id: 'sk5', name: 'Coffee Body Scrub Soap', category: 'soaps', price: 299, description: 'Exfoliating coffee soap that removes dead skin cells and reduces cellulite appearance.', image: '', badge: 'Exfoliant', details: { Weight: '100g', 'Key Ingredients': 'Coffee Grounds, Coconut Oil, Vitamin E', 'Skin Type': 'Normal / Oily' }, inStock: true },
    { id: 'sk6', name: 'Cocoa Butter Body Cream', category: 'body-butter', price: 499, originalPrice: 699, description: 'Rich cocoa butter cream for deep hydration. Keeps skin soft all day.', image: '', badge: 'Moisturizing', details: { Weight: '200g', 'Key Ingredients': 'Cocoa Butter, Vitamin E, Jojoba Oil', 'Skin Type': 'Dry / Very Dry', Texture: 'Rich & Creamy' }, inStock: true },
    { id: 'sk7', name: 'Shea Butter & Almond Body Butter', category: 'body-butter', price: 549, description: 'Lightweight body butter with shea and sweet almond. Absorbs quickly without greasiness.', image: '', details: { Weight: '200g', 'Key Ingredients': 'Shea Butter, Sweet Almond Oil, Beeswax', 'Skin Type': 'Normal / Dry' }, inStock: true },
    { id: 'sk8', name: 'Mango Body Butter – Summer Edition', category: 'body-butter', price: 449, description: 'Tropical mango-scented body butter. Light, fruity, and perfect for summer.', image: '', badge: 'Seasonal', details: { Weight: '150g', 'Key Ingredients': 'Mango Butter, Coconut Oil, Vitamin C', 'Skin Type': 'All Types' }, inStock: true },
    { id: 'sk9', name: 'Beetroot Lip Balm – Tinted', category: 'lip-balms', price: 199, originalPrice: 299, description: 'Natural beetroot tinted lip balm. Gives a subtle pink tint with deep moisturization.', image: '', badge: 'Bestseller', details: { Weight: '10g', 'Key Ingredients': 'Beetroot Extract, Beeswax, Coconut Oil', Type: 'Tinted', SPF: 'SPF 15' }, inStock: true },
    { id: 'sk10', name: 'Honey & Vanilla Lip Balm', category: 'lip-balms', price: 179, description: 'Sweet honey-vanilla lip balm for soft, smooth lips. Perfect for dry weather.', image: '', details: { Weight: '10g', 'Key Ingredients': 'Honey, Vanilla Extract, Shea Butter', Type: 'Clear' }, inStock: true },
    { id: 'sk11', name: 'Strawberry Lip Balm', category: 'lip-balms', price: 179, description: 'Fruity strawberry lip balm with light pink tint. Smells amazing!', image: '', details: { Weight: '10g', 'Key Ingredients': 'Strawberry Extract, Beeswax, Jojoba', Type: 'Lightly Tinted' }, inStock: true },
    { id: 'sk12', name: 'Multani Mitti Face Pack', category: 'face-packs', price: 349, description: 'Classic fuller\'s earth face pack with neem and rose water. Oil control and pore tightening.', image: '', badge: 'Traditional', details: { Weight: '100g', 'Key Ingredients': 'Multani Mitti, Neem, Rose Water', 'Skin Type': 'Oily / Acne-Prone', Uses: '15-20 applications' }, inStock: true },
    { id: 'sk13', name: 'Ubtan Face Pack – Haldi & Chandan', category: 'face-packs', price: 399, originalPrice: 499, description: 'Ayurvedic ubtan with turmeric, sandalwood and gram flour. For natural glow.', image: '', badge: 'Ayurvedic', details: { Weight: '100g', 'Key Ingredients': 'Turmeric, Sandalwood, Gram Flour, Rose', 'Skin Type': 'All Types', Benefit: 'Brightening & Glow' }, inStock: true },
    { id: 'sk14', name: 'Starter Kit – 4 Piece', category: 'gift-combos', price: 899, originalPrice: 1199, description: 'Try our bestsellers: 1 soap + 1 lip balm + 1 face pack + 1 body butter sample.', image: '', badge: 'Best Value', details: { Contents: 'Charcoal Soap + Beetroot Lip Balm + Ubtan Pack (50g) + Cocoa Butter (50g)', Type: 'Starter Kit' }, inStock: true },
    { id: 'sk15', name: 'Self-Care Gift Box – Premium', category: 'gift-combos', price: 1499, originalPrice: 1999, description: 'Luxury gift box with 2 soaps, body butter, lip balm, face pack, and bath salt.', image: '', badge: 'Gift Special', details: { Contents: '2 Soaps + Body Butter + Lip Balm + Face Pack + Bath Salt', Packaging: 'Premium Gift Box', Occasion: 'Birthday / Anniversary / Self-Care' }, inStock: true },
    { id: 'sk16', name: 'Aloe Vera & Green Tea Face Pack', category: 'face-packs', price: 379, description: 'Soothing face pack for sensitive skin. Reduces redness and inflammation.', image: '', details: { Weight: '100g', 'Key Ingredients': 'Aloe Vera, Green Tea, Cucumber Extract', 'Skin Type': 'Sensitive / Normal' }, inStock: true },
    { id: 'sk17', name: 'Wedding Hamper – Bridal Glow Kit', category: 'gift-combos', price: 2499, description: 'Complete bridal glow kit: ubtan, face pack, body butter, lip care, and 3 soaps.', image: '', badge: 'Bridal', details: { Contents: 'Ubtan + Haldi Pack + Body Butter + Lip Balm + 3 Soaps', Packaging: 'Luxury Bridal Box' }, inStock: true },
    { id: 'sk18', name: 'Coconut Body Butter', category: 'body-butter', price: 479, description: 'Pure coconut body butter for intense hydration. Natural coconut fragrance.', image: '', details: { Weight: '200g', 'Key Ingredients': 'Virgin Coconut Oil, Shea Butter', 'Skin Type': 'Dry / Very Dry' }, inStock: true },
  ],
  testimonials: [
    { name: 'Ananya Krishnan', location: 'Bangalore', rating: 5, text: 'The charcoal soap changed my skin! My acne has reduced so much in just 2 weeks. 100% natural ingredients.', avatar: 'AK' },
    { name: 'Ritika Bose', location: 'Kolkata', rating: 5, text: 'The beetroot lip balm is my holy grail product. Natural tint + moisturization = perfection!', avatar: 'RB' },
    { name: 'Manisha Devi', location: 'Jaipur', rating: 5, text: 'Gifted the premium gift box to my mom. She absolutely loved it! Beautiful packaging too.', avatar: 'MD' },
    { name: 'Tanya Sharma', location: 'Delhi', rating: 4, text: 'The ubtan face pack gives such a natural glow. I use it twice a week before events.', avatar: 'TS' },
    { name: 'Prerna Joshi', location: 'Pune', rating: 5, text: 'Finally found skincare that is truly chemical-free. The mango body butter smells divine!', avatar: 'PJ' },
  ],
  orders: [
    { id: 'sko1', orderId: 'NN-4001', customerName: 'Deepa Murthy', customerPhone: '9876543240', customerEmail: 'deepa@email.com', address: '55 HSR Layout', city: 'Bangalore', items: [{ productId: 'sk1', productName: 'Charcoal Detox Soap', quantity: 2, price: 249 }, { productId: 'sk9', productName: 'Beetroot Lip Balm', quantity: 1, price: 199 }], total: 697, status: 'delivered', paymentMode: 'UPI', paymentStatus: 'paid', notes: '', createdAt: '2026-06-18T10:00:00Z' },
    { id: 'sko2', orderId: 'NN-4002', customerName: 'Geeta Rajan', customerPhone: '9876543241', customerEmail: 'geeta@email.com', address: '28 T. Nagar', city: 'Chennai', items: [{ productId: 'sk15', productName: 'Self-Care Gift Box – Premium', quantity: 1, price: 1499 }], total: 1499, status: 'shipped', paymentMode: 'Bank Transfer', paymentStatus: 'paid', notes: 'Gift wrap please', createdAt: '2026-06-22T13:00:00Z' },
    { id: 'sko3', orderId: 'NN-4003', customerName: 'Isha Malhotra', customerPhone: '9876543242', customerEmail: 'isha@email.com', address: '12 Banjara Hills', city: 'Hyderabad', items: [{ productId: 'sk14', productName: 'Starter Kit', quantity: 1, price: 899 }, { productId: 'sk3', productName: 'Turmeric Soap', quantity: 3, price: 349 }], total: 1946, status: 'new', paymentMode: 'COD', paymentStatus: 'unpaid', notes: 'First time ordering', createdAt: '2026-06-25T17:30:00Z' },
    { id: 'sko4', orderId: 'NN-4004', customerName: 'Pallavi Hegde', customerPhone: '9876543243', customerEmail: 'pallavi@email.com', address: '8 Koramangala 4th Block', city: 'Bangalore', items: [{ productId: 'sk6', productName: 'Cocoa Butter Body Cream', quantity: 1, price: 499 }, { productId: 'sk13', productName: 'Ubtan Face Pack', quantity: 1, price: 399 }], total: 898, status: 'confirmed', paymentMode: 'UPI', paymentStatus: 'paid', notes: '', createdAt: '2026-06-24T09:15:00Z' },
    { id: 'sko5', orderId: 'NN-4005', customerName: 'Kavya Shetty', customerPhone: '9876543244', customerEmail: 'kavya@email.com', address: '45 MG Road', city: 'Mangalore', items: [{ productId: 'sk17', productName: 'Wedding Hamper – Bridal Glow Kit', quantity: 1, price: 2499 }], total: 2499, status: 'packed', paymentMode: 'Bank Transfer', paymentStatus: 'paid', notes: 'Wedding on July 10th', createdAt: '2026-06-23T14:30:00Z' },
  ],
}

export default skincareStore
