import express from 'express';
import { StudentSemesterPaymentController } from './studentSemesterPayment.controller';

const router = express.Router();

router.patch(
  '/:id',
  //   validateRequest(StudentSemesterPaymentValidation.updateStudentSemesterPaymentZodSchema),
  StudentSemesterPaymentController.updateSingleStudentSemesterPayment
);
router.delete(
  '/:id',
  StudentSemesterPaymentController.deleteSingleStudentSemesterPayment
);
router.get(
  '/:id',
  StudentSemesterPaymentController.getSingleStudentSemesterPayment
);
router.get('/', StudentSemesterPaymentController.getAllStudentSemesterPayments);

export const StudentSemesterPaymentRoutes = router;
