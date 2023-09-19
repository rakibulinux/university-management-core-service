import { CourseFaculty, Faculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { facultyFilterableFields } from './faculty.constant';
import { FacultyService } from './faculty.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.insertIntoDB(req.body);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Faculty Created!',
    data: result,
  });
});
const getAllFaculties = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, facultyFilterableFields);
  const pagination = pick(req.query, paginationFields);
  const result = await FacultyService.getAllFaculties(filters, pagination);
  sendResponse<Faculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get All  Facultys Successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await FacultyService.getSingleFaculty(id);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Single Faculty Successfully',

    data: result,
  });
});
const updateSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const result = await FacultyService.updateSingleFaculty(id, body);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Faculty Updated Successfully!',
    data: result,
  });
});
const deleteSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await FacultyService.deleteSingleFaculty(id);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Faculty Deleted Successfully!',
    data: result,
  });
});

const assignCourses = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const courses = req.body.courses;
  const result = await FacultyService.assignCourses(id, courses);

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
const removeAssignCourses = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const Courses = req.body.Courses;
  const result = await FacultyService.removeAssignCourses(id, Courses);

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
});
const myCourses = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const filters = pick(req.query, ['academicSemesterId', 'courseId']);
  const result = await FacultyService.myCourses(user, filters);

  sendResponse<CourseFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${
      result
        ? 'My Courses Fatched Successfully!'
        : `No Faculty Find For This ID: ${req.params.id}`
    }`,
    data: result,
  });
});

export const FacultyController = {
  insertIntoDB,
  getAllFaculties,
  getSingleFaculty,
  updateSingleFaculty,
  deleteSingleFaculty,
  assignCourses,
  removeAssignCourses,
  myCourses,
};
