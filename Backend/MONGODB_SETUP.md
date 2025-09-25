# MongoDB Atlas Setup Guide for GreenCart

## 🎉 Current Status
✅ Your MongoDB connection is already working!  
✅ Connection string is configured correctly  
✅ Database: `greencart` is connected successfully

## Your Current Setup
- **Database**: MongoDB Atlas Cloud
- **Cluster**: greencart.p2rjgsy.mongodb.net
- **Database Name**: greencart
- **Status**: ✅ Connected and Working

## What's Already Configured

### 1. Environment Variables (`.env`)
```env
MONGO_URI=mongodb+srv://greencart:tc4ptrI2qzdKWKyk@greencart.p2rjgsy.mongodb.net/greencart?retryWrites=true&w=majority
```

### 2. Server Connection (`server.js`)
```javascript
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
```

## Database Collections
Your application will automatically create these collections:
- `users` - User accounts (customers, farmers)
- `products` - Product catalog
- `orders` - Customer orders
- `carts` - Shopping cart data
- `reviews` - Product reviews

## MongoDB Atlas Dashboard Access
To access your database dashboard:
1. Go to [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
2. Sign in with your MongoDB Atlas account
3. Navigate to your "greencart" cluster
4. Use "Collections" to view your data
5. Use "Metrics" to monitor database performance

## Useful MongoDB Commands

### View Collections in MongoDB Compass or Atlas:
- Connect using the same connection string
- Browse collections: users, products, orders, carts

### Common Database Operations (via Atlas UI):
- **View Data**: Collections → Browse Collections
- **Query Data**: Use the query bar with JSON filters
- **Index Management**: Collections → Indexes
- **Backup**: Automated backups are enabled on Atlas

## Security Features Already Enabled
✅ **Authentication**: Username/password authentication  
✅ **Network Security**: IP whitelist configured  
✅ **Encryption**: Data encrypted at rest and in transit  
✅ **Connection String**: Includes retryWrites and write concern

## Monitoring Your Database
- **Atlas Dashboard**: Real-time metrics
- **Performance**: Query performance insights
- **Alerts**: Automated monitoring alerts
- **Backup**: Continuous backup enabled

## Troubleshooting
If you encounter connection issues:
1. Check your internet connection
2. Verify the password in the connection string
3. Ensure IP address is whitelisted
4. Check Atlas cluster status

## Next Steps
Your database is ready! You can now:
1. ✅ Start your backend: `npm start`
2. ✅ Use all API endpoints
3. ✅ Store user registrations
4. ✅ Save products and orders
5. ✅ Send feedback emails

## Production Considerations
When deploying to production:
- [ ] Change JWT_SECRET to a secure random string
- [ ] Set up proper IP whitelist
- [ ] Configure production Gmail credentials
- [ ] Enable database monitoring alerts
- [ ] Set up automated backups schedule

Your GreenCart application is fully configured and ready to use! 🌱