const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Product = require('../models/Product');
const Feedback = require('../models/Feedback');
require('dotenv').config();

// Sample data
const sampleUsers = [
  // Customers
  {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@customer.com',
    password: 'password123',
    phone: '+977-9841234567',
    role: 'user',
    address: {
      street: 'Thamel Street',
      city: 'Kathmandu',
      state: 'Bagmati',
      zipCode: '44600',
      country: 'Nepal'
    }
  },
  {
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@customer.com',
    password: 'password123',
    phone: '+977-9851234567',
    role: 'user',
    address: {
      street: 'Lakeside',
      city: 'Pokhara',
      state: 'Gandaki',
      zipCode: '33700',
      country: 'Nepal'
    }
  },
  // Farmers
  {
    name: 'Ram Bahadur Thapa',
    username: 'ramthapa',
    email: 'ram@farmer.com',
    password: 'password123',
    phone: '+977-9861234567',
    role: 'farmer',
    address: {
      street: 'Farming Area',
      city: 'Chitwan',
      state: 'Bagmati',
      zipCode: '44200',
      country: 'Nepal'
    }
  },
  {
    name: 'Binita Adhikari',
    username: 'binitaadhikari',
    email: 'binita@farmer.com',
    password: 'password123',
    phone: '+977-9871234567',
    role: 'farmer',
    address: {
      street: 'Valley Farm',
      city: 'Lalitpur',
      state: 'Bagmati',
      zipCode: '44700',
      country: 'Nepal'
    }
  },
  {
    name: 'Kishan Thapa',
    username: 'kishanthapa',
    email: 'kishan@farmer.com',
    password: 'password123',
    phone: '+977-9881234567',
    role: 'farmer',
    address: {
      street: 'Organic Farm',
      city: 'Bhaktapur',
      state: 'Bagmati',
      zipCode: '44800',
      country: 'Nepal'
    }
  },
  {
    name: 'Gopal Adhikari',
    username: 'gopaladhikari',
    email: 'gopal@farmer.com',
    password: 'password123',
    phone: '+977-9891234567',
    role: 'farmer',
    address: {
      street: 'Green Valley',
      city: 'Kavre',
      state: 'Bagmati',
      zipCode: '45200',
      country: 'Nepal'
    }
  },
  // Admin
  {
    name: 'Admin User',
    username: 'admin',
    email: 'admin@greencart.com',
    password: 'admin123',
    phone: '+977-9801234567',
    role: 'admin',
    address: {
      street: 'Admin Office',
      city: 'Kathmandu',
      state: 'Bagmati',
      zipCode: '44600',
      country: 'Nepal'
    }
  }
];

// Sample products (based on your existing frontend data)
const sampleProducts = [
  // Vegetables
  { name: 'Cauliflower', price: 90, category: 'vegetables', unit: 'kg', stock: 50, description: 'Fresh organic cauliflower' },
  { name: 'Cabbage', price: 120, category: 'vegetables', unit: 'kg', stock: 40, description: 'High-quality organic cabbage' },
  { name: 'Potato', price: 80, category: 'vegetables', unit: 'kg', stock: 100, description: 'Organic potatoes' },
  { name: 'Carrot', price: 100, category: 'vegetables', unit: 'kg', stock: 60, description: 'Fresh organic sweet carrot' },
  { name: 'Onion', price: 160, category: 'vegetables', unit: 'kg', stock: 80, description: 'Rich in flavor onion' },
  { name: 'Tomato', price: 100, category: 'vegetables', unit: 'kg', stock: 70, description: 'Fresh organic tomatoes' },
  { name: 'Radish', price: 50, category: 'vegetables', unit: 'kg', stock: 45, description: 'Rich in iron radish' },
  { name: 'Capsicum', price: 150, category: 'vegetables', unit: 'kg', stock: 30, description: 'Rich in taste capsicum' },
  { name: 'Mushroom', price: 280, category: 'vegetables', unit: 'kg', stock: 25, description: 'Rich in protein mushroom' },
  { name: 'Brinjal', price: 100, category: 'vegetables', unit: 'kg', stock: 35, description: 'Rich in fiber brinjal' },
  
  // Fruits
  { name: 'Apple', price: 250, category: 'fruits', unit: 'kg', stock: 60, description: 'Nutrient-rich organic apple' },
  { name: 'Banana', price: 120, category: 'fruits', unit: 'dozen', stock: 80, description: 'High-quality organic banana' },
  { name: 'Pomegranate', price: 350, category: 'fruits', unit: 'kg', stock: 30, description: 'Protein-packed organic pomegranate' },
  { name: 'Grapes', price: 250, category: 'fruits', unit: 'kg', stock: 40, description: 'Rich in iron grapes' },
  { name: 'Mango', price: 120, category: 'fruits', unit: 'kg', stock: 50, description: 'King of fruits mango' },
  { name: 'Orange', price: 150, category: 'fruits', unit: 'kg', stock: 45, description: 'Rich in Vitamin-C orange' },
  { name: 'Watermelon', price: 60, category: 'fruits', unit: 'kg', stock: 25, description: 'Sweet and juicy watermelon' },
  { name: 'Strawberry', price: 250, category: 'fruits', unit: 'kg', stock: 20, description: 'Sweet and juicy strawberry' },
  
  // Grains
  { name: 'Brown Rice', price: 110, category: 'grains', unit: 'kg', stock: 200, description: 'Nutrient-rich organic brown rice' },
  { name: 'White Rice', price: 130, category: 'grains', unit: 'kg', stock: 250, description: 'Premium white rice' },
  { name: 'Whole Wheat', price: 270, category: 'grains', unit: 'kg', stock: 150, description: 'High-quality organic whole wheat' },
  { name: 'Millet', price: 300, category: 'grains', unit: 'kg', stock: 80, description: 'Protein-packed organic millet' },
  { name: 'Corn', price: 150, category: 'grains', unit: 'kg', stock: 120, description: 'Steel-cut organic corn' },
  { name: 'Barley', price: 150, category: 'grains', unit: 'kg', stock: 90, description: 'Organic barley grains' },
  { name: 'Red Lentils', price: 220, category: 'grains', unit: 'kg', stock: 100, description: 'Premium red lentils' },
  { name: 'Black Lentils', price: 280, category: 'grains', unit: 'kg', stock: 85, description: 'Organic black lentils' },
  { name: 'Chickpeas', price: 200, category: 'grains', unit: 'kg', stock: 110, description: 'High-protein chickpeas' }
];

// Sample feedback
const sampleFeedback = [
  {
    fullName: 'Dipendra Silwal',
    phoneNo: '+977-9841111111',
    email: 'dipendra@example.com',
    address: 'Bharatpur, Chitwan',
    feedback: 'I ordered some vegetables yesterday, they were totally fresh, and the delivery was also on time. I highly recommend them for all.',
    rating: 5,
    category: 'product',
    isPublic: true
  },
  {
    fullName: 'Vishal Sharma',
    phoneNo: '+977-9851222222',
    email: 'vishal@example.com',
    address: 'Kathmandu, Nepal',
    feedback: 'Was looking for a Tarkari/Vegetable Delivery service during this lockdown, Really professional, fast, affordable, and reliable Greencart delivery service. Definitely buying from them in the future as well.',
    rating: 5,
    category: 'service',
    isPublic: true
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed functions
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('🧹 Cleared existing users');

    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
    }

    console.log(`✅ Created ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedProducts = async (users) => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('🧹 Cleared existing products');

    // Get farmers from users
    const farmers = users.filter(user => user.role === 'farmer');
    
    const products = [];
    for (const productData of sampleProducts) {
      // Randomly assign farmer
      const farmer = farmers[Math.floor(Math.random() * farmers.length)];
      
      const product = new Product({
        ...productData,
        farmer: farmer._id,
        images: [{
          url: `/images/products/${productData.name.toLowerCase().replace(' ', '_')}.jpg`,
          alt: productData.name,
          isPrimary: true
        }],
        isOrganic: true,
        isActive: true,
        origin: 'Nepal',
        tags: [productData.category, 'organic', 'fresh']
      });

      await product.save();
      products.push(product);
    }

    console.log(`✅ Created ${products.length} products`);
    return products;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
};

const seedFeedback = async () => {
  try {
    // Clear existing feedback
    await Feedback.deleteMany({});
    console.log('🧹 Cleared existing feedback');

    const feedback = [];
    for (const feedbackData of sampleFeedback) {
      const fb = new Feedback(feedbackData);
      await fb.save();
      feedback.push(fb);
    }

    console.log(`✅ Created ${feedback.length} feedback entries`);
    return feedback;
  } catch (error) {
    console.error('❌ Error seeding feedback:', error);
  }
};

// Main seeder function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...\n');
    
    const users = await seedUsers();
    await seedProducts(users);
    await seedFeedback();
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`Products: ${await Product.countDocuments()}`);
    console.log(`Feedback: ${await Feedback.countDocuments()}`);
    
    console.log('\n👥 Test Accounts Created:');
    console.log('Customer: john@customer.com / password123');
    console.log('Farmer: ram@farmer.com / password123');
    console.log('Admin: admin@greencart.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;