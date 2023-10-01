import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentZodSchema,
  ),
  AcademicDepartmentController.insertIntoDB,
);

router.patch(
  '/:id',
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentZodSchema,
  ),
  AcademicDepartmentController.updateSingleAcademicDepartment,
);
router.get('/:id', AcademicDepartmentController.getSingleAcademicDepartment);
router.delete(
  '/:id',
  AcademicDepartmentController.deleteSingleAcademicDepartment,
);
router.get('/', AcademicDepartmentController.getAllAcademicDepartment);

export const AcademicDepartmentRouter = router;
