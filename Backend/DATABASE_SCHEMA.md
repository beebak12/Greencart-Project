# 🗄️ GreenCart Database Schema Documentation

## Database Structure Overview

Your GreenCart MongoDB database now contains the following collections:

## 📋 Collections (Tables) Created:

### 1. **users** 
**Purpose**: Store customer, farmer, and admin account information
- **Customer Signup/Signin**: Regular users who buy products
- **Farmer Signup/Signin**: Users who sell products
- **Admin Users**: System administrators

**Schema Fields:**
```javascript
{
  name: String,              // Full name
  username: String,          // Unique username
  email: String,             // Email address (unique)
  password: String,          // Hashed password
  phone: String,             // Phone number
  address: {                 // Address object
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  role: String,              // 'user', 'farmer', or 'admin'
  isActive: Boolean,         // Account status
  avatar: String,            // Profile picture URL
  createdAt: Date,           // Account creation date
  updatedAt: Date            // Last update date
}
```

**Sample Data Created:**
- 2 Customers (john@customer.com, jane@customer.com)
- 4 Farmers (ram@farmer.com, binita@farmer.com, kishan@farmer.com, gopal@farmer.com)
- 1 Admin (admin@greencart.com)

### 2. **products**
**Purpose**: Store all product information with farmer details, pricing, and stock
- **Product Name, Price, Farmer Name**
- **Stock Quantity Available**
- **Category Classification**

**Schema Fields:**
```javascript
{
  name: String,              // Product name
  description: String,       // Product description
  price: Number,             // Current price
  originalPrice: Number,     // Original price (for discounts)
  category: String,          // 'fruits', 'vegetables', 'grains', etc.
  subcategory: String,       // Subcategory
  images: [{                 // Product images
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  stock: Number,             // Available quantity
  unit: String,              // 'kg', 'pieces', 'liters', etc.
  minOrderQuantity: Number,  // Minimum order quantity
  maxOrderQuantity: Number,  // Maximum order quantity
  farmer: ObjectId,          // Reference to farmer user
  ratings: {                 // Product ratings
    average: Number,
    count: Number
  },
  reviews: [{               // Customer reviews
    user: ObjectId,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  isActive: Boolean,        // Product availability
  isOrganic: Boolean,       // Organic certification
  isFeatured: Boolean,      // Featured product
  origin: String,           // Origin location
  harvestDate: Date,        // When harvested
  expiryDate: Date,         // Expiry date
  nutritionalInfo: {        // Nutritional information
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  tags: [String],           // Search tags
  createdAt: Date,          // Product creation date
  updatedAt: Date           // Last update date
}
```

**Sample Data Created:**
- 27 Products across 3 categories
- 10 Vegetables (Cauliflower, Cabbage, Potato, etc.)
- 8 Fruits (Apple, Banana, Pomegranate, etc.)
- 9 Grains (Brown Rice, Wheat, Millet, etc.)

### 3. **carts**
**Purpose**: Store shopping cart data for each user
- **Products Added to Cart**
- **Quantities and Pricing**

**Schema Fields:**
```javascript
{
  user: ObjectId,           // Reference to user
  items: [{                 // Cart items
    product: ObjectId,      // Reference to product
    quantity: Number,       // Quantity selected
    price: Number,          // Price at time of adding
    addedAt: Date          // When added to cart
  }],
  totalItems: Number,       // Total number of items
  totalAmount: Number,      // Total cart value
  updatedAt: Date          // Last update
}
```

### 4. **orders**
**Purpose**: Store complete order history and billing information
- **Billing History**
- **Order Status Tracking**
- **Payment Information**

**Schema Fields:**
```javascript
{
  orderNumber: String,      // Unique order number (e.g., GC16954821230001)
  user: ObjectId,           // Customer who placed order
  items: [{                 // Ordered items
    product: ObjectId,      // Product reference
    name: String,           // Product name (at time of order)
    price: Number,          // Price (at time of order)
    quantity: Number,       // Quantity ordered
    unit: String,           // Unit of measurement
    farmer: ObjectId        // Farmer reference
  }],
  shippingAddress: {        // Delivery address
    fullName: String,
    phone: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    deliveryInstructions: String
  },
  orderSummary: {           // Bill breakdown
    subtotal: Number,       // Items total
    deliveryFee: Number,    // Delivery charges
    discount: Number,       // Discount amount
    tax: Number,            // Tax amount
    totalAmount: Number     // Final total
  },
  paymentInfo: {            // Payment details
    method: String,         // 'cash_on_delivery', 'esewa', 'khalti', etc.
    status: String,         // 'pending', 'paid', 'failed', 'refunded'
    transactionId: String,  // Payment transaction ID
    paidAt: Date,          // Payment date
    paymentDetails: Object  // Additional payment info
  },
  orderStatus: String,      // 'pending', 'confirmed', 'processing', 'shipped', 'delivered', etc.
  statusHistory: [{         // Order status changes
    status: String,
    timestamp: Date,
    note: String,
    updatedBy: ObjectId
  }],
  delivery: {               // Delivery information
    expectedDate: Date,
    actualDate: Date,
    trackingNumber: String,
    courier: String,
    deliveryNotes: String
  },
  notes: {                  // Order notes
    customerNotes: String,
    adminNotes: String,
    internalNotes: String
  },
  isGift: Boolean,          // Gift order flag
  giftMessage: String,      // Gift message
  cancellation: {           // Cancellation details
    reason: String,
    cancelledBy: ObjectId,
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: String
  },
  createdAt: Date,          // Order creation date
  updatedAt: Date           // Last update date
}
```

### 5. **feedback**
**Purpose**: Store customer feedback and ratings
- **Customer Reviews and Ratings**
- **Feedback Categories**
- **Response Management**

**Schema Fields:**
```javascript
{
  fullName: String,         // Customer name
  phoneNo: String,          // Phone number
  email: String,            // Email address
  address: String,          // Customer address
  feedback: String,         // Feedback message
  rating: Number,           // Rating (1-5)
  category: String,         // 'general', 'product', 'service', etc.
  status: String,           // 'pending', 'reviewed', 'responded', 'resolved'
  isPublic: Boolean,        // Can be shown as testimonial
  adminResponse: {          // Admin response
    message: String,
    respondedBy: ObjectId,
    respondedAt: Date
  },
  user: ObjectId,           // Reference to user (if logged in)
  ipAddress: String,        // IP address
  userAgent: String,        // Browser info
  source: String,           // 'website', 'mobile_app', etc.
  createdAt: Date,          // Feedback creation date
  updatedAt: Date           // Last update date
}
```

**Sample Data Created:**
- 2 Public feedback entries (testimonials)
- Feedback from Dipendra Silwal and Vishal Sharma

## 🔧 Database Operations Available:

### Authentication Operations:
- **Customer Registration**: Create new customer accounts
- **Farmer Registration**: Create new farmer accounts
- **Login System**: Authenticate users with email/password
- **Password Hashing**: Secure password storage with bcrypt
- **Role-based Access**: Different permissions for users, farmers, admins

### Product Operations:
- **Product Creation**: Farmers can add new products
- **Product Listing**: Display all products with filtering
- **Category Filtering**: Filter by vegetables, fruits, grains
- **Search Functionality**: Search by name, description, farmer
- **Stock Management**: Track available quantities
- **Price Management**: Handle pricing and discounts
- **Product Reviews**: Customers can rate and review products

### Shopping Cart Operations:
- **Add to Cart**: Add products with quantities
- **Remove from Cart**: Remove specific items
- **Update Quantities**: Modify item quantities
- **Clear Cart**: Empty entire cart
- **Cart Totals**: Calculate subtotal and total
- **Persistent Cart**: Save cart data per user

### Order Operations:
- **Order Creation**: Convert cart to order
- **Order Tracking**: Track order status changes
- **Billing History**: Complete order history per user
- **Payment Processing**: Handle different payment methods
- **Order Management**: Admin can update order status
- **Delivery Tracking**: Track delivery information

### Feedback Operations:
- **Feedback Submission**: Collect customer feedback
- **Rating System**: 1-5 star ratings
- **Category Classification**: Organize feedback by type
- **Admin Response**: Respond to customer feedback
- **Public Testimonials**: Display approved feedback

## 🚀 Ready-to-Use Test Accounts:

### Customer Accounts:
- **Email**: john@customer.com | **Password**: password123
- **Email**: jane@customer.com | **Password**: password123

### Farmer Accounts:
- **Email**: ram@farmer.com | **Password**: password123
- **Email**: binita@farmer.com | **Password**: password123
- **Email**: kishan@farmer.com | **Password**: password123
- **Email**: gopal@farmer.com | **Password**: password123

### Admin Account:
- **Email**: admin@greencart.com | **Password**: admin123

## 📊 Database Statistics:
- **Total Users**: 7 (2 customers + 4 farmers + 1 admin)
- **Total Products**: 27 (10 vegetables + 8 fruits + 9 grains)
- **Total Feedback**: 2 testimonials
- **Collections**: 5 main collections
- **Indexes**: Optimized for search and performance

## 🔄 Database Maintenance:

### Re-seed Database:
```bash
npm run seed
```

### Connect to Database:
Your database is hosted on MongoDB Atlas and accessible via the connection string in your `.env` file.

## 🔐 Security Features:
- **Password Encryption**: All passwords are hashed using bcrypt
- **Data Validation**: Input validation on all fields
- **Role-based Access**: Different permissions for different user types
- **Secure Connection**: MongoDB Atlas with encrypted connections
- **Index Optimization**: Database indexes for fast queries

Your GreenCart database is now fully configured and ready for production use! 🌱