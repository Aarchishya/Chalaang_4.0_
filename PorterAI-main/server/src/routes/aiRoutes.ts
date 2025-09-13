

import express from 'express';
import { aiReply } from '../controllers/aiController';

const router = express.Router();

router.post('/ai', aiReply);

export default router;