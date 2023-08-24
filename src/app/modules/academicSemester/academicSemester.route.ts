import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/create-semester',
  validateRequest(AcademicSemesterValidation.createAcademicSemesterZodSchema),
  AcademicSemesterController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(AcademicSemesterValidation.updateAcademicSemesterZodSchema),
  AcademicSemesterController.updateSingleAcademicSemester
);
router.get('/:id', AcademicSemesterController.getSingleAcademicSemester);
router.delete('/:id', AcademicSemesterController.deleteSingleAcademicSemester);
router.get('/', AcademicSemesterController.getAllAcademicSemester);

export const AcademicSemesterRouter = router;
