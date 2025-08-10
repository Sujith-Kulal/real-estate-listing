// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';
// import fs from 'fs';

// const router = express.Router();

// // Ensure uploads directory exists
// const uploadsDir = path.join(process.cwd(), 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// // Multer config for saving files to /uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = uuidv4() + path.extname(file.originalname);
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// // POST route to upload multiple listing images
// router.post('/', upload.array('images', 6), (req, res) => {
//   try {
//     const urls = req.files.map((file) => `/uploads/${file.filename}`);
//     return res.status(200).json(urls); // send URLs back to frontend
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: 'Image upload failed' });
//   }
// });

// export default router;

import express from 'express';
import multer from 'multer';
import path from 'path';
import User from '../models/user.model.js';

const router = express.Router();

// Disk storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder where images are stored
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Upload route
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Save only filename in DB
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      { image: req.file.filename },
      { new: true }
    );

    res.json({ success: true, image: req.file.filename, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;












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

