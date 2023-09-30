import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(AcademicSemesterValidation.createAcademicSemesterZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AcademicSemesterController.createAcademicSemester,
);

router.patch(
  '/:id',
  validateRequest(AcademicSemesterValidation.updateAcademicSemesterZodSchema),
  AcademicSemesterController.updateSingleAcademicSemester,
);
router.get('/:id', AcademicSemesterController.getSingleAcademicSemester);
router.delete('/:id', AcademicSemesterController.deleteSingleAcademicSemester);
router.get('/', AcademicSemesterController.getAllAcademicSemester);

export const AcademicSemesterRouter = router;
