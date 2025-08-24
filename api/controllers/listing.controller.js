import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import { sendEmail } from '../utils/sendEmail.js';

export const createListing = async (req, res, next) => {
  try {
    const listingData = { ...req.body, userRef: req.user.id };
    
    // Only calculate totalPrice for sale listings
    if (req.body.type === 'sale' && req.body.plotArea && req.body.pricePerSqft) {
      listingData.totalPrice = req.body.plotArea * req.body.pricePerSqft;
    }
    
    const listing = await Listing.create(listingData);
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
    const updateData = { ...req.body };
    
    // Only calculate totalPrice for sale listings
    if (req.body.type === 'sale' && req.body.plotArea && req.body.pricePerSqft) {
      updateData.totalPrice = req.body.plotArea * req.body.pricePerSqft;
    }
    
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      updateData,
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

// Buyer contacting the owner about a listing
export const contactOwner = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { message } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) return next(errorHandler(404, 'Listing not found!'));

    const owner = await User.findById(listing.userRef).select('email username');
    if (!owner?.email) return next(errorHandler(400, 'Owner email not available'));

    const buyer = await User.findById(req.user.id).select('email username');
    const result = await sendEmail({
      to: owner.email,
      subject: `New interest in your property: ${listing.name}`,
      html: `<p>Hi ${owner.username},</p>
             <p>${buyer.username} is interested in your property <strong>${listing.name}</strong>.</p>
             <p>Message:</p><blockquote>${message || '(no message provided)'} </blockquote>
             <p>Buyer contact: ${buyer.email}</p>`,
      text: `Hi ${owner.username}, ${buyer.username} is interested in ${listing.name}. Message: ${message || '(no message)'} Buyer: ${buyer.email}`
    });

    const sent = result && !result.skipped;
    return res.status(200).json({ 
      message: sent ? 'Email sent to owner' : 'Email skipped (SMTP not configured)',
      sent
    });
  } catch (error) {
    next(error);
  }
};
