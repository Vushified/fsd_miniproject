import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Store } from './models/Store.js';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fsd_project';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB for seeding:', mongoUri);

    // Clear existing data
    await User.deleteMany();
    await Store.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('[Seed] Cleared existing collections.');

    // 1. Create Users
    const customer = await User.create({
      name: 'Vidushi Singh',
      email: 'vidushi@example.com',
      password: 'password123',
      role: 'customer',
      phone: '+91 98765 43210',
      address: 'Flat 402, Sea Breeze Apts, Bandra West, Mumbai 400050',
    });

    const vendor = await User.create({
      name: 'FreshBasket Merchant',
      email: 'vendor@example.com',
      password: 'password123',
      role: 'vendor',
      phone: '+91 98111 22334',
      address: 'Shop 4, Hill Road, Bandra West, Mumbai',
    });

    const driver = await User.create({
      name: 'Ramesh Sharma',
      email: 'driver@example.com',
      password: 'password123',
      role: 'driver',
      phone: '+91 91234 56789',
      address: 'Khar Danda, Mumbai',
    });

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      phone: '+91 99999 88888',
      address: 'Corporate HQ, Mumbai',
    });

    console.log('[Seed] Users created (Customer, Vendor, Driver, Admin).');

    // 2. Create Stores
    const store1 = await Store.create({
      name: 'Fresh Basket QuickMart',
      owner: vendor._id,
      category: 'Groceries',
      rating: 4.8,
      distance: '1.2 km',
      deliveryTime: '10-15 mins',
      address: 'Bandra West, Mumbai',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
      verificationStatus: 'Approved',
    });

    const store2 = await Store.create({
      name: 'Daily Dairy & Bakery',
      owner: vendor._id,
      category: 'Dairy',
      rating: 4.9,
      distance: '0.8 km',
      deliveryTime: '8-12 mins',
      address: 'Khar West, Mumbai',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1528732263440-4dd1a18a4cc2?auto=format&fit=crop&w=600&q=80',
      verificationStatus: 'Approved',
    });

    const store3 = await Store.create({
      name: 'Midnight Snack Shack',
      owner: vendor._id,
      category: 'Snacks',
      rating: 4.6,
      distance: '2.1 km',
      deliveryTime: '15-20 mins',
      address: 'Santacruz, Mumbai',
      isOpen: true,
      image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
      verificationStatus: 'Approved',
    });

    console.log('[Seed] Stores created.');

    // 3. Create Products
    const products = await Product.create([
      {
        store: store2._id,
        name: 'Amul Taaza Homogenised Toned Milk',
        category: 'Dairy',
        price: 33,
        originalPrice: 35,
        unit: '500 ml',
        stock: 45,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80',
        description: 'Pasteurised toned milk with 3.0% fat and 8.5% SNF.',
      },
      {
        store: store2._id,
        name: 'Amul Salted Butter',
        category: 'Dairy',
        price: 58,
        originalPrice: 60,
        unit: '100 g',
        stock: 30,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80',
        description: 'Classic golden butter made from fresh cream.',
      },
      {
        store: store3._id,
        name: "Lay's India's Magic Masala Chips",
        category: 'Snacks',
        price: 20,
        originalPrice: 20,
        unit: '50 g',
        stock: 60,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80',
        description: 'Spicy and crunchy potato chips infused with Indian spices.',
      },
      {
        store: store1._id,
        name: 'Tata Sampann High Protein Toor Dal',
        category: 'Groceries',
        price: 185,
        originalPrice: 199,
        unit: '1 kg',
        stock: 25,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
        description: 'Unpolished toor dal rich in natural protein.',
      },
      {
        store: store1._id,
        name: 'Fortune Sunlite Refined Sunflower Oil',
        category: 'Groceries',
        price: 145,
        originalPrice: 160,
        unit: '1 L',
        stock: 30,
        inStock: true,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80',
        description: 'Light and healthy cooking oil enriched with vitamins A & D.',
      },
    ]);

    console.log('[Seed] Products created.');

    // 4. Create Sample Orders
    await Order.create({
      orderNumber: 'ORD-9281',
      customer: customer._id,
      store: store1._id,
      driver: driver._id,
      items: [
        { product: products[3]._id, name: products[3].name, price: 185, quantity: 1, available: true },
        { product: products[4]._id, name: products[4].name, price: 145, quantity: 2, available: true },
      ],
      totalAmount: 475,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      status: 'Packing',
      deliveryAddress: customer.address,
    });

    console.log('[Seed] Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();

