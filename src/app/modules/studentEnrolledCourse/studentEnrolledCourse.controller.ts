import { StudentEnrolledCourse } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentEnrolledCourseFilterableFields } from './studentEnrolledCourse.constant';
import { StudentEnrolledCourseService } from './studentEnrolledCourse.service';

const getAllStudentEnrolledCourses = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, studentEnrolledCourseFilterableFields);
    const pagination = pick(req.query, paginationFields);
    const result =
      await StudentEnrolledCourseService.getAllStudentEnrolledCourses(
        filters,
        pagination
      );

    sendResponse<StudentEnrolledCourse[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get All Student Enrolled Course Successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);
const getSingleStudentEnrolledCourse = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentEnrolledCourseService.getSingleStudentEnrolledCourse(
        req.params.id
      );

    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${
        result
          ? 'Get A Single Student Enrolled Course Successfully!'
          : `No Student Enrolled Course Find For This ID: ${req.params.id}`
      }`,
      data: result,
    });
  }
);

const updateSingleStudentEnrolledCourse = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentEnrolledCourseService.updateSingleStudentEnrolledCourse(
        req.params.id,
        req.body
      );
    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Update A Single Student Enrolled Course Successfully!',
      data: result,
    });
  }
);
const deleteSingleStudentEnrolledCourse = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentEnrolledCourseService.deleteSingleStudentEnrolledCourse(
        req.params.id
      );

    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Delete A Single Student Enrolled Course Successfully!',
      data: result,
    });
  }
);

export const StudentEnrolledCourseController = {
  getAllStudentEnrolledCourses,
  getSingleStudentEnrolledCourse,
  updateSingleStudentEnrolledCourse,
  deleteSingleStudentEnrolledCourse,
};
