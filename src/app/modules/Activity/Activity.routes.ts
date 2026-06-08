import express from 'express';
import auth from '../../middlewares/auth';
import { ActivityController } from './Activity.controller';

const router = express.Router();

router.get('/', auth(), ActivityController.getActivities);


export const ActivityRoutes = router;