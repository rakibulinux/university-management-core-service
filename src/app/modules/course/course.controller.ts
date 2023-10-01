import { Course, CourseFaculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { courseFilterableFields } from './course.constant';
import { CourseService } from './course.service';

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.createCourse(req.body);
  console.log(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Created successufully!',
    data: result,
  });
});
const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, courseFilterableFields);
  const pagination = pick(req.query, paginationFields);
  const result = await CourseService.getAllCourses(filters, pagination);

  sendResponse<Course[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get All Course Successfully!',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.getSingleCourse(req.params.id);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${
      result
        ? 'Get A Single Course Successfully!'
        : `No Course Find For This ID: ${req.params.id}`
    }`,
    data: result,
  });
});
const updateSingleCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.updateSingleCourse(
    req.params.id,
    req.body
  );
  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update A Single Course Successfully!',
    data: result,
  });
});
const deleteSingleCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.deleteSingleCourse(req.params.id);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delete A Single Course Successfully!',
    data: result,
  });
});

const assignFaculties = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const faculties = req.body.faculties;
  const result = await CourseService.assignFaculties(id, faculties);

  sendResponse<CourseFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${
      result
        ? 'Course Faculty Assigned Successfully!'
        : `No Faculty Find For This ID: ${req.params.id}`
    }`,
    data: result,
  });
});
const removeAssignFaculties = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const faculties = req.body.faculties;
    const result = await CourseService.removeAssignFaculties(id, faculties);

    sendResponse<CourseFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${
        result
          ? 'Course Faculty Deleted Successfully!'
          : `No Faculty Find For This ID: ${req.params.id}`
      }`,
      data: result,
    });
  }
);

export const CourseController = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateSingleCourse,
  deleteSingleCourse,
  assignFaculties,
  removeAssignFaculties,
};
