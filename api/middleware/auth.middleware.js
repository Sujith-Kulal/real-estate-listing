import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const verifyAdminToken = async (req, res, next) => {
  const token = req.cookies.admin_token;
  
  if (!token) {
    return next(errorHandler(401, 'Access denied. No token provided.'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is admin
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return next(errorHandler(403, 'Access denied. Admin privileges required.'));
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return next(errorHandler(401, 'Invalid token.'));
  }
};

export const verifyUserToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  
  if (!token) {
    return next(errorHandler(401, 'Access denied. No token provided.'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(errorHandler(401, 'Invalid token.'));
  }
};
