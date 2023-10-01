import express from 'express';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMark.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.patch(
  '/update-mark',
  auth(ENUM_USER_ROLE.FACULTY),
  StudentEnrolledCourseMarkController.updateSingleStudentEnrolledCourseMark,
);
router.patch(
  '/update-final-mark',
  auth(ENUM_USER_ROLE.FACULTY),
  StudentEnrolledCourseMarkController.updateFinalMarks,
);

router.get(
  '/my-marks',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentEnrolledCourseMarkController.getMyCourseMarks,
);
router.get(
  '/',
  StudentEnrolledCourseMarkController.getAllStudentEnrolledCourseMarks,
);

export const StudentEnrolledMarkRoutes = router;
