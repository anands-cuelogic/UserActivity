import express from 'express';
import UserActivityController from './Controller/UserActivityController';

const router = express.Router();

router.get('/', UserActivityController.getActivityDetail);

export default router;