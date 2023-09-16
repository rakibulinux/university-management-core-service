import { StudentEnrolledCourseMark } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentEnrolledCourseMarkFilterableFields } from './studentEnrolledCourseMark.constant';
import { StudentEnrolledCourseMarkService } from './studentEnrolledCourseMark.service';

// const updateStudnetMark = catchAsync(async (req: Request, res: Response) => {
//   const result =
//     await StudentEnrolledCourseMarkService.updateSingleStudentEnrolledCourseMark(
//       req.params.id,
//       req.body
//     );
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Update A Student Mark Successfully!',
//     data: result,
//   });
// });

const getAllStudentEnrolledCourseMarks = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
    const pagination = pick(req.query, paginationFields);
    const result =
      await StudentEnrolledCourseMarkService.getAllStudentEnrolledCourseMarks(
        filters,
        pagination
      );

    sendResponse<StudentEnrolledCourseMark[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get All Student Enrolled Course Mark Successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);
const getSingleStudentEnrolledCourseMark = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentEnrolledCourseMarkService.getSingleStudentEnrolledCourseMark(
        req.params.id
      );

    sendResponse<StudentEnrolledCourseMark>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${
        result
          ? 'Get A Single Student Enrolled Course Mark Successfully!'
          : `No Student Enrolled Course Mark Find For This ID: ${req.params.id}`
      }`,
      data: result,
    });
  }
);
const updateSingleStudentEnrolledCourseMark = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentEnrolledCourseMarkService.updateSingleStudentEnrolledCourseMark(
        req.body
      );
    sendResponse<StudentEnrolledCourseMark>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Update A Single Student Enrolled Course Mark Successfully!',
      data: result,
    });
  }
);
const updateFinalMarks = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentEnrolledCourseMarkService.updateFinalMarks(
    req.body
  );
  sendResponse<StudentEnrolledCourseMark>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update A Single Student Enrolled Course Mark Successfully!',
    data: result,
  });
});
const deleteSingleStudentEnrolledCourseMark = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentEnrolledCourseMarkService.deleteSingleStudentEnrolledCourseMark(
        req.params.id
      );

    sendResponse<StudentEnrolledCourseMark>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Delete A Single Student Enrolled Course Mark Successfully!',
      data: result,
    });
  }
);

export const StudentEnrolledCourseMarkController = {
  getAllStudentEnrolledCourseMarks,
  getSingleStudentEnrolledCourseMark,
  updateSingleStudentEnrolledCourseMark,
  deleteSingleStudentEnrolledCourseMark,
  updateFinalMarks,
};
