import { OfferedCourse } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { offeredCourseFilterableFields } from './offeredCourses.constant';
import { OfferedCourseService } from './offeredCourses.service';

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseService.createOfferedCourse(req.body);
  console.log(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${
      !result
        ? 'Offered Course Created successufully!'
        : 'Offered Course Already Exsist'
    }`,
    data: result,
  });
});
const getAllOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, offeredCourseFilterableFields);
  const pagination = pick(req.query, paginationFields);
  const result = await OfferedCourseService.getAllOfferedCourses(
    filters,
    pagination
  );

  sendResponse<OfferedCourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get All OfferedCourse Successfully!',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseService.getSingleOfferedCourse(
      req.params.id
    );

    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${
        result
          ? 'Get A Single OfferedCourse Successfully!'
          : `No OfferedCourse Find For This ID: ${req.params.id}`
      }`,
      data: result,
    });
  }
);
const updateSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseService.updateSingleOfferedCourse(
      req.params.id,
      req.body
    );
    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Update A Single OfferedCourse Successfully!',
      data: result,
    });
  }
);
const deleteSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseService.deleteSingleOfferedCourse(
      req.params.id
    );

    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Delete A Single OfferedCourse Successfully!',
      data: result,
    });
  }
);

export const OfferedCourseController = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateSingleOfferedCourse,
  deleteSingleOfferedCourse,
};
