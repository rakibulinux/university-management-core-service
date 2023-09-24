import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
const router = express.Router();

router.post(
  '/:id/start-new-semester',
  auth(ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.startNewSemester,
);

router.patch(
  '/:id',
  // validateRequest(SemesterRegistrationValidation.updateSemesterRegistrationZodSchema),
  SemesterRegistrationController.updateSingleSemesterRegistration,
);
router.delete(
  '/:id',
  SemesterRegistrationController.deleteSingleSemesterRegistration,
);
router.get(
  '/get-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.getMyRegistration,
);
router.get(
  '/get-my-semester',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.getMySemesterRegistration,
);
router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistration,
);
router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);

router.post(
  '/start-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.createStartMyRegistration,
);

router.post(
  '/enroll-into-course',
  auth(ENUM_USER_ROLE.STUDENT),
  validateRequest(
    SemesterRegistrationValidation.createEnrollAndWithdrawCourseZodSchema,
  ),
  SemesterRegistrationController.enrollIntoCourse,
);
router.post(
  '/withdraw-from-course',
  auth(ENUM_USER_ROLE.STUDENT),
  validateRequest(
    SemesterRegistrationValidation.createEnrollAndWithdrawCourseZodSchema,
  ),
  SemesterRegistrationController.withdrawFromCourse,
);
router.post(
  '/confirm-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.confirmMyRegistration,
);
router.post(
  '/',
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationZodSchema,
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.createSemesterRegistration,
);

export const SemesterRegistrationRoute = router;
