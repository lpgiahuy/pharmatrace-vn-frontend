export const mockProducts = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: ['Vitamin C 1000mg', 'Paracetamol 500mg', 'Omega-3 Fish Oil', 'Probiotics Daily', 'Zinc Supplement', 'B-Complex Vitamins'][i % 6],
  slug: `product-${i + 1}`,
  price: Math.floor(Math.random() * 200000) + 50000,
  originalPrice: Math.floor(Math.random() * 300000) + 150000,
  image: `https://placehold.co/400x400/e6f2ff/0b7de8?text=Pharma+${i+1}`,
  category: ['Vitamins & Supplements', 'Pain Relief', 'Cold & Flu'][i % 3],
  categoryId: (i % 3) + 1,
  rating: (Math.random() * 2 + 3).toFixed(1),
  reviewCount: Math.floor(Math.random() * 500),
  inStock: i % 7 !== 0,
  isPrescription: i % 9 === 0,
  discount: Math.floor(Math.random() * 30),
  brand: ['Doppelherz', 'DHC', 'Nature Made', 'Blackmores'][i % 4],
  tags: ['bestseller', 'new', 'sale'].slice(0, (i % 3) + 1),
  description: 'High-quality pharmaceutical grade supplement manufactured under strict GMP standards. Clinically tested and certified safe for daily use.',
  specifications: { weight: '100g', servings: '30 capsules', form: 'Capsule' },
  batchNumber: `BATCH-${String(i + 1).padStart(4, '0')}`,
  expiryDate: '2026-12-31',
}))

export const mockOrders = Array.from({ length: 12 }, (_, i) => ({
  id: `ORD-${String(i + 1001).padStart(6, '0')}`,
  date: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  status: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'][i % 6],
  total: Math.floor(Math.random() * 2000000) + 100000,
  items: Math.floor(Math.random() * 5) + 1,
  paymentMethod: ['cod', 'vnpay', 'momo'][i % 3],
  address: '123 Nguyen Hue, District 1, Ho Chi Minh City',
}))

export const mockStats = {
  revenue:       { value: 1_245_000_000, change: +12.5, trend: 'up' },
  orders:        { value: 3_847,         change: +8.2,  trend: 'up' },
  customers:     { value: 12_456,        change: +5.1,  trend: 'up' },
  lowStock:      { value: 23,            change: +3,    trend: 'down' },
}

export const mockRevenueChart = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  revenue: Math.floor(Math.random() * 500_000_000) + 800_000_000,
  orders: Math.floor(Math.random() * 500) + 300,
}))

export const mockInventory = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  productId: i + 1,
  productName: mockProducts[i]?.name || `Product ${i+1}`,
  batchNumber: `BATCH-${String(i + 1).padStart(4, '0')}`,
  quantity: Math.floor(Math.random() * 500) + 10,
  reserved: Math.floor(Math.random() * 50),
  location: `A${Math.floor(i/5)+1}-${String(i%5+1).padStart(2,'0')}`,
  expiryDate: '2026-12-31',
  status: i % 8 === 0 ? 'low_stock' : i % 12 === 0 ? 'expired' : 'active',
  supplierName: ['PharmaCo', 'MediSupply', 'HealthDist'][i % 3],
  receivedDate: new Date(Date.now() - i * 86400000 * 7).toISOString(),
}))

export const mockUsers = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name:  ['Nguyen Van A', 'Tran Thi B', 'Le Van C', 'Pham Thi D', 'Hoang Van E'][i % 5],
  email: `user${i+1}@pharmachain.vn`,
  role:  ['admin', 'manager', 'warehouse', 'pharmacist', 'staff'][i % 5],
  status: i % 5 !== 0 ? 'active' : 'inactive',
  createdAt: new Date(Date.now() - i * 86400000 * 30).toISOString(),
  avatar: null,
}))

export const mockVouchers = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  code: `PHARMA${String(i+1).padStart(2,'0')}`,
  type: ['percent', 'fixed', 'freeship'][i % 3],
  value: [20, 50000, 0][i % 3],
  minOrder: [200000, 500000, 300000][i % 3],
  usageLimit: 100,
  usedCount: Math.floor(Math.random() * 80),
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  status: i % 4 !== 0 ? 'active' : 'inactive',
}))

export const mockBlogs = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: ['5 Essential Vitamins for Immunity', 'Understanding Prescription Labels', 'COVID-19 Prevention Guide', 'Healthy Living Tips for 2024'][i % 4],
  slug: `blog-${i+1}`,
  excerpt: 'Learn how to maintain optimal health with proper nutrition and medication management.',
  coverImage: `https://placehold.co/800x400/e6f2ff/0b7de8?text=Health+Blog+${i+1}`,
  category: ['Health Tips', 'Medicine Guide', 'Wellness'][i % 3],
  author: 'Dr. Nguyen Thi Lan',
  publishedAt: new Date(Date.now() - i * 86400000 * 5).toISOString(),
  views: Math.floor(Math.random() * 5000) + 500,
  tags: ['health', 'medicine', 'wellness'],
}))
