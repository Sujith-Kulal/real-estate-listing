import express from 'express';
import { 
  adminSignin, 
  getDashboardStats, 
  getPendingListings, 
  approveListing, 
  rejectListing, 
  getAllUsers, 
  adminSignOut 
} from '../controllers/admin.controller.js';
import { verifyAdminToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin authentication
router.post("/signin", adminSignin);
router.get("/signout", adminSignOut);

// Protected admin routes
router.get("/dashboard-stats", verifyAdminToken, getDashboardStats);
router.get("/pending-listings", verifyAdminToken, getPendingListings);
router.get("/users", verifyAdminToken, getAllUsers);
router.put("/approve-listing/:listingId", verifyAdminToken, approveListing);
router.put("/reject-listing/:listingId", verifyAdminToken, rejectListing);

export default router;
