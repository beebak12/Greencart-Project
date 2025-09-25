const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middleware (order is important!)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

// Feedback endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { fullName, phoneNo, email, address, feedback } = req.body;

    // Input validation
    if (!fullName || !phoneNo || !feedback) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone number, and feedback are required'
      });
    }

    // Email validation
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }
    }

    // Create email content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'bibekpoudel@gmail.com',
      subject: `GreenCart Feedback from ${fullName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #27ae60; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
            .field { margin-bottom: 15px; }
            .field-label { font-weight: bold; color: #2c3e50; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #7f8c8d; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌱 GreenCart Feedback</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="field-label">Name:</span> ${fullName}
              </div>
              <div class="field">
                <span class="field-label">Phone:</span> ${phoneNo}
              </div>
              ${email ? `<div class="field"><span class="field-label">Email:</span> ${email}</div>` : ''}
              ${address ? `<div class="field"><span class="field-label">Address:</span> ${address}</div>` : ''}
              <div class="field">
                <span class="field-label">Feedback:</span><br>
                <p>${feedback.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            <div class="footer">
              <p>This feedback was submitted through GreenCart website on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        GreenCart Feedback
        ==================
        
        Name: ${fullName}
        Phone: ${phoneNo}
        ${email ? `Email: ${email}` : ''}
        ${address ? `Address: ${address}` : ''}
        
        Feedback:
        ${feedback}
        
        Submitted on: ${new Date().toLocaleString()}
      `
    };

    // Send email
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({
      success: true,
      message: 'Thank you for your feedback! Your message has been sent successfully.'
    });
  } catch (error) {
    console.error('Error sending feedback email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send feedback. Please try again later.'
    });
  }
});

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "🌱 GreenCart API is running...",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      cart: "/api/cart",
      orders: "/api/orders",
      feedback: "/api/feedback"
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productsRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/ordersRoutes'));
app.use('/api/farmers', require('./routes/farmersRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});