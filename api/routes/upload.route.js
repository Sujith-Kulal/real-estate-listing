import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import User from '../models/user.model.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  }
});

// Profile picture upload (single image)
router.post("/profile", upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.body.userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing image or userId' 
      });
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    const imageUrl = `${backendUrl}/uploads/${req.file.filename}`;

    // Update user with new avatar URL
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { avatar: imageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      user: user 
    });
  } catch (error) {
    console.error('Profile upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Upload failed' 
    });
  }
});

// Listing images upload (multiple images)
router.post("/", upload.array("images", 6), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No files uploaded" 
      });
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    const fileUrls = req.files.map(
      (file) => `${backendUrl}/uploads/${file.filename}`
    );
    
    res.json(fileUrls);
  } catch (error) {
    console.error('Listing upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Upload failed' 
    });
  }
});

export default router;


// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import User from '../models/user.model.js';

// const router = express.Router();

// // Disk storage for uploaded images
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // folder where images are stored
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + '-' + file.originalname;
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({ storage });

// // Upload route
// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//     // Save only filename in DB
//     const updatedUser = await User.findByIdAndUpdate(
//       req.body.userId,
//       { image: req.file.filename },
//       { new: true }
//     );

//     res.json({ success: true, image: req.file.filename, user: updatedUser });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;












// import express from 'express';
// import multer from 'multer';
// // import User from '../models/user.js';
// import User from '../models/user.model.js';


// const router = express.Router();

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // router.post('/', upload.single('image'), async (req, res) => {
// //   try {
// //     const base64 = req.file.buffer.toString('base64');
// //     const contentType = req.file.mimetype;

// //     const user = await User.findById(req.body.userId);
// //     if (!user) {
// //       return res.status(404).json({ success: false, message: 'User not found' });
// //     }
// //     //  user.avatar = { data: base64, contentType };

// //     user.avatar = { data: base64, contentType };
// //     await user.save();

// //     res.status(200).json({ data: base64, contentType });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ success: false, message: 'Upload failed' });
// //   }
// // });


// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     // ✅ Log incoming data
//     console.log('Received file:', req.file);
//     console.log('Received userId:', req.body.userId);

//     if (!req.file || !req.body.userId) {
//       return res.status(400).json({ success: false, message: 'Missing image or userId' });
//     }

//     const base64 = req.file.buffer.toString('base64');
//     const contentType = req.file.mimetype;

//     const user = await User.findById(req.body.userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     user.avatar = { data: base64, contentType };
//     await user.save();

//     res.status(200).json({ data: base64, contentType });
//   } catch (err) {
//     console.error('Upload Error:', err.message);
//     res.status(500).json({ success: false, message: 'Upload failed' });
//   }
// });


// export default router;
















// const express = require('express');
// const multer = require('multer');
// const router = express.Router();
// const User = require('../models/User');

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     const base64 = req.file.buffer.toString('base64');
//     const contentType = req.file.mimetype;

//     const user = await User.findById(req.body.userId);
//     if (!user) return res.status(404).json({ success: false, message: 'User not found' });

//     user.avatar = { data: base64, contentType };
//     await user.save();

//     res.status(200).json({ data: base64, contentType });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Upload failed' });
//   }
// });

// // module.exports = router;
// export default router; 

