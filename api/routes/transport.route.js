import express from 'express';
import { getNearbyTransport } from '../controllers/transport.controller.js';

const router = express.Router();

router.get('/nearby', getNearbyTransport);

export default router;


