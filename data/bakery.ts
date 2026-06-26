import { DemoStoreConfig } from '@/lib/demo-store-types'

const bakeryStore: DemoStoreConfig = {
  id: 'bakery',
  name: 'SweetCrumb Bakery',
  tagline: 'Baked with Love, Delivered with Joy',
  description: 'Homemade cakes, brownies, cupcakes and cookies — made fresh for every celebration.',
  whatsappNumber: '917904072714',
  instagramHandle: '@sweetcrumbbakery',
  email: 'orders@sweetcrumbbakery.in',
  categories: [
    { id: 'birthday-cakes', name: 'Birthday Cakes', icon: '🎂', count: 5 },
    { id: 'cupcakes', name: 'Cupcakes', icon: '🧁', count: 4 },
    { id: 'brownies', name: 'Brownies', icon: '🍫', count: 4 },
    { id: 'cookies', name: 'Cookies', icon: '🍪', count: 3 },
    { id: 'dessert-boxes', name: 'Dessert Boxes', icon: '🎁', count: 4 },
  ],
  products: [
    { id: 'bk1', name: 'Classic Chocolate Truffle Cake', category: 'birthday-cakes', price: 799, originalPrice: 999, description: 'Rich dark chocolate truffle cake with ganache frosting. Our most loved birthday cake.', image: '', badge: 'Bestseller', variants: [{ label: 'Weight', options: ['500g', '1kg', '1.5kg', '2kg'] }, { label: 'Type', options: ['Eggless', 'With Egg'] }], details: { Flavour: 'Dark Chocolate', Layers: '2', Frosting: 'Chocolate Ganache', 'Shelf Life': '3 days (refrigerated)' }, inStock: true },
    { id: 'bk2', name: 'Red Velvet Cake', category: 'birthday-cakes', price: 899, description: 'Gorgeous red velvet cake with cream cheese frosting. Instagram-worthy!', image: '', badge: 'Popular', variants: [{ label: 'Weight', options: ['500g', '1kg', '1.5kg', '2kg'] }, { label: 'Type', options: ['Eggless', 'With Egg'] }], details: { Flavour: 'Red Velvet', Frosting: 'Cream Cheese', Layers: '3' }, inStock: true },
    { id: 'bk3', name: 'Butterscotch Crunch Cake', category: 'birthday-cakes', price: 749, description: 'Soft butterscotch sponge with caramel crunch and praline topping.', image: '', variants: [{ label: 'Weight', options: ['500g', '1kg', '1.5kg'] }, { label: 'Type', options: ['Eggless', 'With Egg'] }], details: { Flavour: 'Butterscotch', Topping: 'Caramel Praline' }, inStock: true },
    { id: 'bk4', name: 'Photo Cake – Custom Design', category: 'birthday-cakes', price: 1199, description: 'Personalized photo cake with edible print. Send us the image on WhatsApp!', image: '', badge: 'Custom Order', variants: [{ label: 'Weight', options: ['1kg', '1.5kg', '2kg'] }, { label: 'Base', options: ['Vanilla', 'Chocolate', 'Pineapple'] }], details: { Type: 'Custom Photo Print', 'Min. Order': '1kg', 'Lead Time': '24 hours' }, inStock: true },
    { id: 'bk5', name: 'Pineapple Cake', category: 'birthday-cakes', price: 649, description: 'Fresh pineapple cake with whipped cream and cherry. Classic celebration choice.', image: '', variants: [{ label: 'Weight', options: ['500g', '1kg', '1.5kg'] }, { label: 'Type', options: ['Eggless'] }], details: { Flavour: 'Pineapple', Frosting: 'Whipped Cream' }, inStock: true },
    { id: 'bk6', name: 'Chocolate Cupcakes – Box of 6', category: 'cupcakes', price: 449, description: 'Moist chocolate cupcakes with buttercream swirl. Perfect party treats.', image: '', variants: [{ label: 'Type', options: ['Eggless', 'With Egg'] }], details: { Quantity: '6 pcs', Flavour: 'Chocolate', Frosting: 'Buttercream' }, inStock: true },
    { id: 'bk7', name: 'Rainbow Cupcakes – Box of 6', category: 'cupcakes', price: 549, description: 'Colorful vanilla cupcakes with rainbow buttercream. Kids love these!', image: '', badge: 'Kids Fav', variants: [{ label: 'Type', options: ['Eggless', 'With Egg'] }], details: { Quantity: '6 pcs', Flavour: 'Vanilla', Frosting: 'Rainbow Buttercream' }, inStock: true },
    { id: 'bk8', name: 'Assorted Mini Cupcakes – Box of 12', category: 'cupcakes', price: 699, description: 'Mixed flavors: chocolate, vanilla, red velvet, butterscotch. Great for gifting.', image: '', details: { Quantity: '12 pcs (3 each)', Flavours: '4 Assorted' }, inStock: true },
    { id: 'bk9', name: 'Fudge Brownies – Box of 6', category: 'brownies', price: 399, originalPrice: 499, description: 'Dense, fudgy chocolate brownies with walnuts. Melt-in-mouth goodness.', image: '', badge: 'Bestseller', variants: [{ label: 'Type', options: ['Eggless', 'With Egg'] }, { label: 'Add-on', options: ['Plain', 'With Walnuts', 'With Nutella'] }], details: { Quantity: '6 pcs', Texture: 'Fudgy', 'Shelf Life': '5 days' }, inStock: true },
    { id: 'bk10', name: 'Salted Caramel Brownies – Box of 6', category: 'brownies', price: 449, description: 'Chocolate brownies with sea salt caramel drizzle. Sweet and salty perfection.', image: '', badge: 'New', variants: [{ label: 'Type', options: ['Eggless'] }], details: { Quantity: '6 pcs', Texture: 'Fudgy', Topping: 'Sea Salt Caramel' }, inStock: true },
    { id: 'bk11', name: 'Butter Cookies Tin – 250g', category: 'cookies', price: 349, description: 'Melt-in-mouth Danish style butter cookies in a cute tin.', image: '', details: { Weight: '250g', Type: 'Butter Cookies', Packaging: 'Gift Tin' }, inStock: true },
    { id: 'bk12', name: 'Choco Chip Cookies – Pack of 12', category: 'cookies', price: 299, description: 'Crispy on the edges, chewy in the center. Loaded with choco chips.', image: '', details: { Quantity: '12 pcs', Type: 'Choco Chip', 'Shelf Life': '7 days' }, inStock: true },
    { id: 'bk13', name: 'Birthday Dessert Box', category: 'dessert-boxes', price: 999, originalPrice: 1299, description: '4 brownies + 4 cupcakes + 6 cookies. Complete birthday celebration box!', image: '', badge: 'Value Pack', details: { Contents: 'Brownies (4) + Cupcakes (4) + Cookies (6)', 'Best For': 'Birthday / Party' }, inStock: true },
    { id: 'bk14', name: 'Festival Gift Box', category: 'dessert-boxes', price: 1499, description: 'Assorted sweets box: brownies, cookies, macarons, and cake slices. Perfect Diwali/Rakhi gift.', image: '', badge: 'Gift Special', details: { Contents: '16 assorted pieces', Packaging: 'Premium Gift Box', Occasion: 'Festival / Gifting' }, inStock: true },
    { id: 'bk15', name: 'Mini Dessert Jar Set – 4 Pack', category: 'dessert-boxes', price: 599, description: 'Set of 4 dessert jars: tiramisu, chocolate mousse, cheesecake, mango pudding.', image: '', badge: 'Trending', details: { Quantity: '4 Jars', Size: '150ml each', Flavours: 'Tiramisu, Mousse, Cheesecake, Mango' }, inStock: true },
  ],
  testimonials: [
    { name: 'Aishwarya Rao', location: 'Bangalore', rating: 5, text: 'The chocolate truffle cake was out of this world! Everyone at the party was asking for the bakery name.', avatar: 'AR' },
    { name: 'Poornima S.', location: 'Chennai', rating: 5, text: 'Ordered brownies for my office — they disappeared in 10 minutes! So fudgy and rich.', avatar: 'PS' },
    { name: 'Kamal Khan', location: 'Hyderabad', rating: 4, text: 'The photo cake for my daughter was perfect. She was so happy. Thank you SweetCrumb!', avatar: 'KK' },
    { name: 'Nisha Menon', location: 'Kochi', rating: 5, text: 'Best cupcakes in town! The rainbow ones are my go-to for kids birthdays.', avatar: 'NM' },
    { name: 'Rohini Patil', location: 'Pune', rating: 5, text: 'The festival gift box was beautifully packed. My relatives were so impressed!', avatar: 'RP' },
  ],
  orders: [
    { id: 'bko1', orderId: 'SC-3001', customerName: 'Vinay Kumar', customerPhone: '9876543230', customerEmail: 'vinay@email.com', address: '22 JP Nagar 5th Phase', city: 'Bangalore', items: [{ productId: 'bk1', productName: 'Chocolate Truffle Cake – 1kg', quantity: 1, price: 799, variant: '1kg / Eggless' }], total: 799, status: 'delivered', paymentMode: 'UPI', paymentStatus: 'paid', notes: 'Write "Happy Birthday Arjun"', createdAt: '2026-06-20T08:00:00Z' },
    { id: 'bko2', orderId: 'SC-3002', customerName: 'Shreya Bhat', customerPhone: '9876543231', customerEmail: 'shreya@email.com', address: '14 Indiranagar', city: 'Bangalore', items: [{ productId: 'bk9', productName: 'Fudge Brownies – Box of 6', quantity: 2, price: 399, variant: 'Eggless / With Walnuts' }, { productId: 'bk12', productName: 'Choco Chip Cookies', quantity: 1, price: 299 }], total: 1097, status: 'confirmed', paymentMode: 'COD', paymentStatus: 'unpaid', notes: '', createdAt: '2026-06-24T11:30:00Z' },
    { id: 'bko3', orderId: 'SC-3003', customerName: 'Arun Prasad', customerPhone: '9876543232', customerEmail: 'arun@email.com', address: '67 Velachery', city: 'Chennai', items: [{ productId: 'bk13', productName: 'Birthday Dessert Box', quantity: 1, price: 999 }], total: 999, status: 'new', paymentMode: 'UPI', paymentStatus: 'paid', notes: 'Delivery by 4 PM please', createdAt: '2026-06-25T14:00:00Z' },
    { id: 'bko4', orderId: 'SC-3004', customerName: 'Meghna R.', customerPhone: '9876543233', customerEmail: 'meghna@email.com', address: '33 Koregaon Park', city: 'Pune', items: [{ productId: 'bk4', productName: 'Photo Cake – Custom', quantity: 1, price: 1199, variant: '1.5kg / Chocolate' }], total: 1199, status: 'packed', paymentMode: 'Bank Transfer', paymentStatus: 'paid', notes: 'Photo sent on WhatsApp', createdAt: '2026-06-23T09:45:00Z' },
  ],
}

export default bakeryStore
