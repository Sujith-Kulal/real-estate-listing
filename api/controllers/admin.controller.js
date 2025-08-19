import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// Admin login
export const adminSignin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log('Admin login attempt:', { email, password: password ? '***' : 'missing' });
  
  try {
    const validUser = await User.findOne({ email });
    console.log('User found:', validUser ? { id: validUser._id, role: validUser.role } : 'Not found');
    
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    
    // Check if user is admin
    if (validUser.role !== 'admin') {
      console.log('User is not admin, role:', validUser.role);
      return next(errorHandler(403, 'Access denied. Admin privileges required.'));
    }
    
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    console.log('Password validation:', validPassword ? 'Success' : 'Failed');
    
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    
    const token = jwt.sign({ id: validUser._id, role: validUser.role }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    
    console.log('Admin login successful, sending response');
    
    res
      .cookie('admin_token', token, { 
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      })
      .status(200)
      .json(rest);
  } catch (error) {
    console.error('Admin login error:', error);
    next(error);
  }
};

// Get admin dashboard stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalListings = await Listing.countDocuments();
    const pendingListings = await Listing.countDocuments({ status: 'pending' });
    const approvedListings = await Listing.countDocuments({ status: 'approved' });
    const rejectedListings = await Listing.countDocuments({ status: 'rejected' });
    
    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({ 
      role: 'user', 
      createdAt: { $gte: sevenDaysAgo } 
    });
    
    // Get recent listings (last 7 days)
    const recentListings = await Listing.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    res.status(200).json({
      totalUsers,
      totalListings,
      pendingListings,
      approvedListings,
      rejectedListings,
      recentUsers,
      recentListings
    });
  } catch (error) {
    next(error);
  }
};

// Get all pending listings for admin approval
export const getPendingListings = async (req, res, next) => {
  try {
    const pendingListings = await Listing.find({ status: 'pending' })
      .sort({ createdAt: -1 });

    // Manually attach owner details since userRef is stored as string
    const listingsWithOwner = await Promise.all(
      pendingListings.map(async (doc) => {
        const owner = await User.findById(doc.userRef).select('username email phone');
        return { ...doc._doc, owner };
      })
    );
    
    res.status(200).json(listingsWithOwner);
  } catch (error) {
    next(error);
  }
};

// Approve a listing
export const approveListing = async (req, res, next) => {
  const { listingId } = req.params;
  const { adminNotes } = req.body;
  const adminId = req.user.id;
  
  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    
    listing.status = 'approved';
    listing.adminNotes = adminNotes || '';
    listing.approvedBy = adminId;
    listing.approvedAt = new Date();
    
    await listing.save();

    try {
      // notify owner
      const owner = await User.findById(listing.userRef).select('email username phone');
      if (owner?.email) {
        await sendEmail({
          to: owner.email,
          subject: `Your listing "${listing.name}" is approved` ,
          html: `<p>Hi ${owner.username},</p><p>Your listing <strong>${listing.name}</strong> has been approved by admin.</p><p>Notes: ${listing.adminNotes || 'N/A'}</p>`,
          text: `Hi ${owner?.username}, Your listing ${listing.name} has been approved. Notes: ${listing.adminNotes || 'N/A'}`
        });
      }
    } catch (e) {
      console.warn('Failed to send approval email', e?.message);
    }

    res.status(200).json({ message: 'Listing approved successfully!', listing });
  } catch (error) {
    next(error);
  }
};

// Reject a listing
export const rejectListing = async (req, res, next) => {
  const { listingId } = req.params;
  const { adminNotes } = req.body;
  const adminId = req.user.id;
  
  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    
    listing.status = 'rejected';
    listing.adminNotes = adminNotes || '';
    listing.approvedBy = adminId;
    listing.approvedAt = new Date();
    
    await listing.save();

    try {
      const owner = await User.findById(listing.userRef).select('email username phone');
      if (owner?.email) {
        await sendEmail({
          to: owner.email,
          subject: `Your listing "${listing.name}" is rejected` ,
          html: `<p>Hi ${owner.username},</p><p>Your listing <strong>${listing.name}</strong> was rejected by admin.</p><p>Reason: ${listing.adminNotes || 'Not specified'}.</p>`,
          text: `Hi ${owner?.username}, Your listing ${listing.name} was rejected. Reason: ${listing.adminNotes || 'Not specified'}.`
        });
      }
    } catch (e) {
      console.warn('Failed to send rejection email', e?.message);
    }

    res.status(200).json({ message: 'Listing rejected successfully!', listing });
  } catch (error) {
    next(error);
  }
};

// Get all users for admin management
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Admin signout
export const adminSignOut = async (req, res, next) => {
  try {
    res.clearCookie('admin_token');
    res.status(200).json('Admin has been logged out!');
  } catch (error) {
    next(error);
  }
};
