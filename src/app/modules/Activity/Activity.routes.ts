import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ActivityController } from './Activity.controller';
import { ActivityValidation } from './Activity.validation';

const router = express.Router();

router.post(
'/',
auth(),
validateRequest(ActivityValidation.createSchema),
ActivityController.createActivity,
);

router.get('/', auth(), ActivityController.getActivityList);

router.get('/:id', auth(), ActivityController.getActivityById);

router.put(
'/:id',
auth(),
validateRequest(ActivityValidation.updateSchema),
ActivityController.updateActivity,
);

router.delete('/:id', auth(), ActivityController.deleteActivity);

export const ActivityRoutes = router;