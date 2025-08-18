import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    // Calculate total price based on plot area and price per sqft
    const { plotArea, pricePerSqft } = req.body;
    const totalPrice = plotArea * pricePerSqft;
    
    const listing = await Listing.create({ 
      ...req.body, 
      userRef: req.user.id,
      totalPrice: totalPrice
    });
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    // Calculate total price based on plot area and price per sqft
    const { plotArea, pricePerSqft } = req.body;
    const totalPrice = plotArea * pricePerSqft;
    
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, totalPrice: totalPrice },
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    
    // Only show approved listings to regular users (unless admin is requesting)
    if (!req.user || req.user.role !== 'admin') {
      if (listing.status !== 'approved') {
        return next(errorHandler(404, 'Listing not found!'));
      }
    }
    
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    // Normalize sort field to match schema
    let sort = req.query.sort || 'createdAt';
    if (sort === 'created_at') sort = 'createdAt';
    if (sort === 'regularPrice') sort = 'totalPrice';

    const order = req.query.order || 'desc';

    // Build the filter object (only fields supported by the Listing schema)
    const filter = {
      name: { $regex: searchTerm, $options: 'i' },
      type,
    };

    // Only show approved listings to regular users (unless admin is requesting)
    if (!req.user || req.user.role !== 'admin') {
      filter.status = 'approved';
    }

    const listings = await Listing.find(filter)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    // Return empty array if no listings found (this is normal, not an error)
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
