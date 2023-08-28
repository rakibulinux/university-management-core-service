import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';
const router = express.Router();

router.patch(
  '/:id',
  // validateRequest(CourseValidation.updateCourseZodSchema),
  CourseController.updateSingleCourse
);
router.delete('/:id', CourseController.deleteSingleCourse);
router.get('/:id', CourseController.getSingleCourse);
router.get('/', CourseController.getAllCourses);
router.post(
  '/',
  validateRequest(CourseValidation.createCourseZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.createCourse
);
router.post(
  '/:id/assign-faculties',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(CourseValidation.assignOrRemoveFacultiesZodValidation),
  CourseController.assignFaculties
);
router.delete(
  '/:id/remove-faculties',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(CourseValidation.assignOrRemoveFacultiesZodValidation),
  CourseController.removeAssignFaculties
);
export const CourseRoute = router;
