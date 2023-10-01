import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseController } from './offeredCourses.controller';
import { OfferedCourseValidation } from './offeredCourses.validation';
const router = express.Router();

router.patch(
  '/:id',
  validateRequest(OfferedCourseValidation.updateOfferedCourseZodSchema),
  OfferedCourseController.updateSingleOfferedCourse
);
router.delete('/:id', OfferedCourseController.deleteSingleOfferedCourse);
router.get('/:id', OfferedCourseController.getSingleOfferedCourse);
router.get('/', OfferedCourseController.getAllOfferedCourses);
router.post(
  '/',
  validateRequest(OfferedCourseValidation.createOfferedCourseZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseController.createOfferedCourse
);

export const OfferedCourseRoute = router;
