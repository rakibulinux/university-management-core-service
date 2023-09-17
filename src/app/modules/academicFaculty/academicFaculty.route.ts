import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.post(
  '/create-faculty',
  validateRequest(AcademicFacultyValidation.createAcademicFacultyZodSchema),
  AcademicFacultyController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(AcademicFacultyValidation.updateAcademicFacultyZodSchema),
  AcademicFacultyController.updateSingleAcademicFaculty
);
router.get('/:id', AcademicFacultyController.getSingleAcademicFaculty);
router.delete('/:id', AcademicFacultyController.deleteSingleAcademicFaculty);
router.get('/', AcademicFacultyController.getAllAcademicFaculties);

export const AcademicFacultyRouter = router;
