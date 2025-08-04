import express from 'express';
import multer from 'multer';
// import User from '../models/user.js';
import User from '../models/user.model.js';


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     const base64 = req.file.buffer.toString('base64');
//     const contentType = req.file.mimetype;

//     const user = await User.findById(req.body.userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
//     //  user.avatar = { data: base64, contentType };

//     user.avatar = { data: base64, contentType };
//     await user.save();

//     res.status(200).json({ data: base64, contentType });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Upload failed' });
//   }
// });


router.post('/', upload.single('image'), async (req, res) => {
  try {
    // ✅ Log incoming data
    console.log('Received file:', req.file);
    console.log('Received userId:', req.body.userId);

    if (!req.file || !req.body.userId) {
      return res.status(400).json({ success: false, message: 'Missing image or userId' });
    }

    const base64 = req.file.buffer.toString('base64');
    const contentType = req.file.mimetype;

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.avatar = { data: base64, contentType };
    await user.save();

    res.status(200).json({ data: base64, contentType });
  } catch (err) {
    console.error('Upload Error:', err.message);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});


export default router;
















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

