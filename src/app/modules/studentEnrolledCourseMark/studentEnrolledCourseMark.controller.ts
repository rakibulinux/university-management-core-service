import { StudentEnrolledCourseMark } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentEnrolledCourseMarkFilterableFields } from './studentEnrolledCourseMark.constant';
import { StudentEnrolledCourseMarkService } from './studentEnrolledCourseMark.service';

const getAllStudentEnrolledCourseMarks = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
    const pagination = pick(req.query, paginationFields);
    const result =
      await StudentEnrolledCourseMarkService.getAllStudentEnrolledCourseMarks(
        filters,
        pagination,
      );

    sendResponse<StudentEnrolledCourseMark[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get All Student Enrolled Course Mark Successfully!',
      meta: result.meta,
      data: result.data,
    });
  },
);
const getMyCourseMarks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const user = req.user;
  const result = await StudentEnrolledCourseMarkService.getMyCourseMarks(
    filters,
    options,
    user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student course marks fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});
const updateSingleStudentEnrolledCourseMark = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentEnrolledCourseMarkService.updateSingleStudentEnrolledCourseMark(
        req.body,
      );
    sendResponse<StudentEnrolledCourseMark>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Update A Single Student Enrolled Course Mark Successfully!',
      data: result,
    });
  },
);
const updateFinalMarks = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentEnrolledCourseMarkService.updateFinalMarks(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update A Single Student Enrolled Course Mark Successfully!',
    data: result,
  });
});

export const StudentEnrolledCourseMarkController = {
  getAllStudentEnrolledCourseMarks,
  getMyCourseMarks,
  updateSingleStudentEnrolledCourseMark,

  updateFinalMarks,
};
