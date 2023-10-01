import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentEnrolledCourseController } from './studentEnrolledCourse.controller';
import { StudentEnrolledCourseValidation } from './studentEnrolledCourse.validation';

const router = express.Router();

router.patch(
  '/:id',
  validateRequest(
    StudentEnrolledCourseValidation.updateStudentEnrolledCourseZodSchema
  ),
  StudentEnrolledCourseController.updateSingleStudentEnrolledCourse
);
router.delete(
  '/:id',
  StudentEnrolledCourseController.deleteSingleStudentEnrolledCourse
);

router.get(
  '/:id',
  StudentEnrolledCourseController.getSingleStudentEnrolledCourse
);
router.get('/', StudentEnrolledCourseController.getAllStudentEnrolledCourses);

export const StudentEnrolledCourseRoutes = router;
