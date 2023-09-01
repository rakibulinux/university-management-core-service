import { SemesterRegistration } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { semesterRegistrationFilterableFields } from './semesterRegistration.constant';
import { SemesterRegistrationService } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationService.createSemesterRegistration(
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration Created successufully!',
      data: result,
    });
  }
);

const createStartMyRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await SemesterRegistrationService.createStartMyRegistration(
      user.studentId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Start Semester Registration Created successufully!',
      data: result,
    });
  }
);
const getAllSemesterRegistrations = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, semesterRegistrationFilterableFields);
    const pagination = pick(req.query, paginationFields);
    const result =
      await SemesterRegistrationService.getAllSemesterRegistrations(
        filters,
        pagination
      );

    sendResponse<SemesterRegistration[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get All SemesterRegistration Successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);
const getSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationService.getSingleSemesterRegistration(
        req.params.id
      );

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${
        result
          ? 'Get A Single SemesterRegistration Successfully!'
          : `No SemesterRegistration Find For This ID: ${req.params.id}`
      }`,
      data: result,
    });
  }
);
const updateSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationService.updateSingleSemesterRegistration(
        req.params.id,
        req.body
      );
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Update A Single SemesterRegistration Successfully!',
      data: result,
    });
  }
);
const deleteSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationService.deleteSingleSemesterRegistration(
        req.params.id
      );

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Delete A Single SemesterRegistration Successfully!',
      data: result,
    });
  }
);

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSingleSemesterRegistration,
  deleteSingleSemesterRegistration,
  createStartMyRegistration,
};
