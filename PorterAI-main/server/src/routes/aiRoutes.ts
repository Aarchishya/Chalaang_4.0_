

import express from 'express';
import { aiReply } from '../controllers/aiController';

const router = express.Router();

router.post('/', aiReply);

export default router;