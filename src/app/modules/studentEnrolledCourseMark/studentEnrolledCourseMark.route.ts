import express from 'express';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMark.controller';

const router = express.Router();

router.patch(
  '/update-mark',
  StudentEnrolledCourseMarkController.updateSingleStudentEnrolledCourseMark
);
router.patch(
  '/update-final-mark',
  StudentEnrolledCourseMarkController.updateFinalMarks
);

router.delete(
  '/:id',
  StudentEnrolledCourseMarkController.deleteSingleStudentEnrolledCourseMark
);
router.get(
  '/:id',
  StudentEnrolledCourseMarkController.getSingleStudentEnrolledCourseMark
);
router.get(
  '/',
  StudentEnrolledCourseMarkController.getAllStudentEnrolledCourseMarks
);

export const StudentEnrolledMarkRoutes = router;
