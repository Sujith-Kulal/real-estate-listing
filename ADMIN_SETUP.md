# BHUMI Admin Panel Setup Guide

This guide explains how to set up and use the new admin functionality in the BHUMI application.

## Features Added

### 1. Integrated Admin Authentication
- Admin login integrated into main SignIn page
- User type selection (User/Admin) during login
- Role-based access control with admin privileges
- Separate admin tokens and authentication flow

### 2. Admin Dashboard
- Real-time statistics (total users, listings, pending approvals)
- Recent activity tracking (last 7 days)
- User management interface

### 3. Listing Approval System
- All new listings require admin approval before being visible
- Admin can approve or reject listings with optional notes
- Only approved listings appear in search results and home page
- Users can see listing status and admin feedback

### 4. Enhanced Security
- Admin-only routes and middleware
- Separate authentication flow for admins
- Role verification on all admin endpoints

## Setup Instructions

### 1. Backend Setup

First, ensure your backend dependencies are installed:

```bash
cd api
npm install
```

### 2. Create Admin User

Run the admin creation script to create your first admin user:

```bash
cd api
npm run create-admin
```

This will create an admin user with:
- Email: `admin@gmail.com`
- Password: `admin123`
- Role: `admin`

**Important**: Change these credentials after first login for security!

### 3. Environment Variables

Ensure your `.env` file contains:

```env
MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Start the Backend

```bash
cd api
npm start
```

### 5. Frontend Setup

Install frontend dependencies:

```bash
cd client
npm install
```

### 6. Start the Frontend

```bash
cd client
npm run dev
```

## Usage

### Admin Login

1. Navigate to `/sign-in`
2. Select "Admin" as user type
3. Use admin credentials: `admin@gmail.com` / `admin123`
4. You'll be redirected to the admin dashboard

### User Login

1. Navigate to `/sign-in`
2. Select "User" as user type (default)
3. Use your regular user credentials
4. You'll be redirected to the home page

### Admin Dashboard

The dashboard has three main sections:

#### 1. Dashboard Overview
- Total users count
- Total listings count
- Pending listings count
- Approved listings count
- Recent user registrations (last 7 days)
- Recent listing submissions (last 7 days)

#### 2. Pending Listings
- Review all submitted listings
- Approve or reject with optional notes
- See listing details and user information

#### 3. User Management
- View all registered users
- See user registration dates
- Monitor user activity

### Listing Approval Workflow

1. **User submits listing** → Status: `pending`
2. **Admin reviews listing** → Can approve or reject
3. **If approved** → Status: `approved`, visible to all users
4. **If rejected** → Status: `rejected`, not visible to users

### User Experience

- **Pending listings**: Users can see their listing status as "Pending"
- **Approved listings**: Appear in search results and home page
- **Rejected listings**: Users can see rejection reason and status
- **Status visibility**: All users can see listing approval status

## API Endpoints

### Admin Authentication
- `POST /api/admin/signin` - Admin login
- `GET /api/admin/signout` - Admin logout

### Admin Dashboard
- `GET /api/admin/dashboard-stats` - Get dashboard statistics
- `GET /api/admin/pending-listings` - Get pending listings
- `GET /api/admin/users` - Get all users

### Listing Management
- `PUT /api/admin/approve-listing/:id` - Approve a listing
- `PUT /api/admin/reject-listing/:id` - Reject a listing

## Security Features

### 1. Role-Based Access Control
- Only users with `role: 'admin'` can access admin endpoints
- Regular users cannot access admin functionality

### 2. Token Verification
- Admin endpoints verify admin tokens
- Separate token system from regular user authentication

### 3. Middleware Protection
- All admin routes protected by `verifyAdminToken` middleware
- Automatic role verification on each request

## Database Changes

### User Model Updates
- Added `role` field with enum: `['user', 'admin']`
- Default role is `'user'`

### Listing Model Updates
- Added `status` field with enum: `['pending', 'approved', 'rejected']`
- Added `adminNotes` field for admin feedback
- Added `approvedBy` and `approvedAt` fields for audit trail

## Frontend Changes

### 1. Integrated Login System
- Single SignIn page with user type selection
- Radio buttons to choose between User and Admin
- Automatic routing based on user type

### 2. Status Indicators
- Listing status shown on individual listing pages
- Status badges in user profile listings
- Color-coded status indicators (green=approved, red=rejected, yellow=pending)

### 3. Conditional Admin Access
- Admin dashboard link only visible to admin users
- Route protection for admin-only pages

## Troubleshooting

### Common Issues

1. **Admin login fails**
   - Ensure admin user exists in database
   - Check if role field is set to 'admin'
   - Verify JWT_SECRET is set correctly

2. **Listings not showing**
   - Check if listings have 'approved' status
   - Verify admin approval workflow is working

3. **Permission denied errors**
   - Ensure user has admin role
   - Check if admin token is valid
   - Verify middleware is properly configured

### Debug Steps

1. Check MongoDB for admin user existence
2. Verify admin token in browser cookies
3. Check server logs for authentication errors
4. Ensure all environment variables are set

## Customization

### Adding New Admin Features

1. Create controller function in `api/controllers/admin.controller.js`
2. Add route in `api/routes/admin.route.js`
3. Create frontend component/page
4. Add to admin dashboard navigation

### Modifying Approval Workflow

1. Update listing model status enums
2. Modify approval/rejection logic in controller
3. Update frontend to handle new statuses
4. Adjust listing visibility filters

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Verify database connections
4. Ensure all dependencies are installed

---

**Note**: This admin system provides a foundation for content moderation. Consider implementing additional features like:
- Bulk approval/rejection
- Email notifications
- Advanced filtering and search
- Audit logging
- Admin activity tracking
