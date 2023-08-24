import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';

const router = express.Router();

router.post(
  '/create-faculty',
  validateRequest(FacultyValidation.createFacultyZodSchema),
  FacultyController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(FacultyValidation.updateFacultyZodSchema),
  FacultyController.updateSingleFaculty
);
router.get('/:id', FacultyController.getSingleFaculty);
router.delete('/:id', FacultyController.deleteSingleFaculty);
router.get('/', FacultyController.getAllFaculties);

export const FacultyRouter = router;
