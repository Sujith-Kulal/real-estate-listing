# Admin Login Troubleshooting Guide

If the admin login function is not working, follow these steps to identify and fix the issue:

## 🔍 **Step 1: Check if Admin User Exists**

First, verify that the admin user exists in your database:

```bash
cd api
npm run test-admin
```

**Expected Output:**
```
✅ Admin user found:
  - ID: [some-id]
  - Email: admin@gmail.com
  - Username: admin
  - Role: admin
  - Created: [timestamp]
```

**If admin user not found:**
```bash
npm run create-admin
```

## 🔍 **Step 2: Verify Environment Variables**

Ensure your `.env` file contains:

```env
MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

**Important:** The JWT_SECRET must be set for admin authentication to work.

## 🔍 **Step 3: Check Backend Server**

1. **Start the backend server:**
   ```bash
   cd api
   npm run dev
   ```

2. **Verify server is running:**
   - Should see: "Server is running on port 3000!"
   - Should see: "Connected to MongoDB!"

## 🔍 **Step 4: Test Admin Login Endpoint**

Test the admin login API directly:

```bash
curl -X POST http://localhost:3000/api/admin/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin123"}'
```

**Expected Response:**
```json
{
  "_id": "...",
  "username": "admin",
  "email": "admin@gmail.com",
  "role": "admin",
  "avatar": "..."
}
```

## 🔍 **Step 5: Check Frontend Console**

1. Open browser developer tools (F12)
2. Go to Console tab
3. Try to login as admin
4. Look for error messages and logs

**Expected Console Output:**
```
Attempting login with: {email: "admin@gmail.com", userType: "admin", endpoint: "/api/admin/signin", hasPassword: true}
Response status: 200
Response text: {"_id":"...","username":"admin",...}
Parsed response data: {_id:"...",...}
Login successful, user data: {...}
Login successful, navigating...
```

## 🔍 **Step 6: Check Backend Console**

Look at your backend server console for admin login attempts:

**Expected Backend Output:**
```
Admin login attempt: { email: 'admin@gmail.com', password: '***' }
User found: { id: '...', role: 'admin' }
Password validation: Success
Admin login successful, sending response
```

## 🚨 **Common Issues & Solutions**

### **Issue 1: "User not found"**
- **Cause:** Admin user doesn't exist in database
- **Solution:** Run `npm run create-admin`

### **Issue 2: "Access denied. Admin privileges required"**
- **Cause:** User exists but doesn't have admin role
- **Solution:** Check database, user should have `role: 'admin'`

### **Issue 3: "Wrong credentials"**
- **Cause:** Password is incorrect
- **Solution:** Use exactly `admin123` as password

### **Issue 4: "JWT_SECRET is not defined"**
- **Cause:** Missing JWT_SECRET in .env file
- **Solution:** Add JWT_SECRET to your .env file

### **Issue 5: CORS errors**
- **Cause:** Frontend and backend ports don't match
- **Solution:** Ensure backend runs on port 3000, frontend on port 5173

### **Issue 6: "Cannot read property 'role' of null"**
- **Cause:** User object is null
- **Solution:** Check if user exists in database

## 🔧 **Debugging Commands**

### **Check Database Connection:**
```bash
cd api
node -e "
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
mongoose.connect(process.env.MONGO)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));
"
```

### **Check All Users:**
```bash
cd api
node -e "
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
dotenv.config();
mongoose.connect(process.env.MONGO)
  .then(async () => {
    const users = await User.find({});
    console.log('All users:', users.map(u => ({email: u.email, role: u.role})));
    mongoose.disconnect();
  });
"
```

### **Test JWT Secret:**
```bash
cd api
node -e "
import dotenv from 'dotenv';
dotenv.config();
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
"
```

## 📋 **Complete Setup Checklist**

- [ ] MongoDB is running and accessible
- [ ] `.env` file contains MONGO and JWT_SECRET
- [ ] Admin user exists in database (`npm run create-admin`)
- [ ] Backend server is running (`npm run dev`)
- [ ] Frontend is running (`npm run dev`)
- [ ] No CORS errors in browser console
- [ ] Admin login endpoint responds correctly
- [ ] User has admin role in database

## 🆘 **Still Having Issues?**

If you're still experiencing problems:

1. **Check the backend console** for detailed error messages
2. **Check the browser console** for frontend errors
3. **Verify database connection** and admin user existence
4. **Test the API endpoint directly** using curl or Postman
5. **Check environment variables** are properly loaded

## 📞 **Support**

For additional help:
1. Check the backend server logs
2. Verify database connectivity
3. Test API endpoints directly
4. Check browser developer tools for errors
