import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';
import { OfferedCourseClassScheduleValidation } from './offeredCourseClassSchedule.validation';

const router = express.Router();

router.patch(
  '/:id',
  validateRequest(
    OfferedCourseClassScheduleValidation.updateOfferedCourseClassScheduleZodSchema
  ),
  OfferedCourseClassScheduleController.updateSingleOfferedCourseClassSchedule
);
router.delete(
  '/:id',
  OfferedCourseClassScheduleController.deleteSingleOfferedCourseClassSchedule
);
router.get(
  '/:id',
  OfferedCourseClassScheduleController.getSingleOfferedCourseClassSchedule
);
router.get(
  '/',
  OfferedCourseClassScheduleController.getAllOfferedCourseClassSchedules
);
router.post(
  '/',
  validateRequest(
    OfferedCourseClassScheduleValidation.createOfferedCourseClassScheduleZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseClassScheduleController.createOfferedCourseClassSchedule
);

export const OfferedCourseClassScheduleRoute = router;
