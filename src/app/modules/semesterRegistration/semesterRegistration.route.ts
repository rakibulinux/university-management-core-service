import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
const router = express.Router();

router.patch(
  '/:id',
  // validateRequest(SemesterRegistrationValidation.updateSemesterRegistrationZodSchema),
  SemesterRegistrationController.updateSingleSemesterRegistration
);
router.delete(
  '/:id',
  SemesterRegistrationController.deleteSingleSemesterRegistration
);
router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistration
);
router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);
router.post(
  '/',
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.createSemesterRegistration
);

export const SemesterRegistrationRoute = router;
