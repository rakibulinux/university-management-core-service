import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseSectionController } from './offeredCourseSection.controller';
import { OfferedCourseSectionValidation } from './offeredCourseSection.validation';

const router = express.Router();

router.patch(
  '/:id',
  validateRequest(
    OfferedCourseSectionValidation.updateOfferedCourseSectionZodSchema
  ),
  OfferedCourseSectionController.updateSingleOfferedCourseSection
);
router.delete(
  '/:id',
  OfferedCourseSectionController.deleteSingleOfferedCourseSection
);
router.get(
  '/:id',
  OfferedCourseSectionController.getSingleOfferedCourseSection
);
router.get('/', OfferedCourseSectionController.getAllOfferedCourseSections);
router.post(
  '/',
  validateRequest(
    OfferedCourseSectionValidation.createOfferedCourseSectionZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectionController.createOfferedCourseSection
);

export const OfferedCourseSectionRoute = router;
