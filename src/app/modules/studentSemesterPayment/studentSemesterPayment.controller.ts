import { StudentSemesterPayment } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentSemesterPaymentFilterableFields } from './studentSemesterPayment.constant';
import { StudentSemesterPaymentService } from './studentSemesterPayment.service';

const getAllStudentSemesterPayments = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, studentSemesterPaymentFilterableFields);
    const pagination = pick(req.query, paginationFields);
    const result =
      await StudentSemesterPaymentService.getAllStudentSemesterPayments(
        filters,
        pagination
      );

    sendResponse<StudentSemesterPayment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get All Student Semester Payment Successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);
const getSingleStudentSemesterPayment = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentSemesterPaymentService.getSingleStudentSemesterPayment(
        req.params.id
      );

    sendResponse<StudentSemesterPayment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${
        result
          ? 'Get A Single Student Semester Payment Successfully!'
          : `No Student Semester Payment Find For This ID: ${req.params.id}`
      }`,
      data: result,
    });
  }
);
const updateSingleStudentSemesterPayment = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentSemesterPaymentService.updateSingleStudentSemesterPayment(
        req.params.id,
        req.body
      );
    sendResponse<StudentSemesterPayment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Update A Single Student Semester Payment Successfully!',
      data: result,
    });
  }
);
const deleteSingleStudentSemesterPayment = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentSemesterPaymentService.deleteSingleStudentSemesterPayment(
        req.params.id
      );

    sendResponse<StudentSemesterPayment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Delete A Single Student Semester Payment Successfully!',
      data: result,
    });
  }
);

export const StudentSemesterPaymentController = {
  getAllStudentSemesterPayments,
  getSingleStudentSemesterPayment,
  updateSingleStudentSemesterPayment,
  deleteSingleStudentSemesterPayment,
};
