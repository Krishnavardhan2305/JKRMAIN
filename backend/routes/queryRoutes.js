import express from 'express';
import multer from 'multer';
import  isAuthenticated from "../middleware/isAuthenticated.js"

import { getqueries, raiseQueryController } from '../controllers/querycontroller.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/raise-query', isAuthenticated, upload.single('image'), raiseQueryController);
router.get('/getqueries',getqueries);

export default router;
