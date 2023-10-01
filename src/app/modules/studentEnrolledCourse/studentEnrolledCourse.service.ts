import { Prisma, StudentEnrolledCourse } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { studentEnrolledCourseSearchableFields } from './studentEnrolledCourse.constant';
import { IStudentEnrolledCourseFilterRequest } from './studentEnrolledCourse.interface';

const createStudentEnrolledCourse = async (
  data: StudentEnrolledCourse
): Promise<StudentEnrolledCourse> => {
  const result = await prisma.studentEnrolledCourse.create({
    data,
    include: {
      student: true,
      course: true,
      academicSemester: true,
      studentEnrolledCourseMarks: true,
    },
  });
  return result;
};

const getAllStudentEnrolledCourses = async (
  filters: IStudentEnrolledCourseFilterRequest,
  pagination: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourse[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);
  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      OR: studentEnrolledCourseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.StudentEnrolledCourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: string } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await prisma.studentEnrolledCourse.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
    include: {
      student: true,
      course: true,
      academicSemester: true,
      studentEnrolledCourseMarks: true,
    },
  });

  const total = await prisma.studentEnrolledCourse.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleStudentEnrolledCourse = async (id: string) => {
  const result = await prisma.studentEnrolledCourse.findUnique({
    where: {
      id,
    },
    include: {
      student: true,
      course: true,
      academicSemester: true,
      studentEnrolledCourseMarks: true,
    },
  });
  return result;
};

const updateSingleStudentEnrolledCourse = async (
  id: string,
  data: Partial<StudentEnrolledCourse>
): Promise<StudentEnrolledCourse> => {
  const result = await prisma.studentEnrolledCourse.update({
    where: {
      id,
    },
    data,
  });
  return result;
};
const deleteSingleStudentEnrolledCourse = async (
  id: string
): Promise<StudentEnrolledCourse> => {
  const result = await prisma.studentEnrolledCourse.delete({
    where: {
      id,
    },
  });
  return result;
};

export const StudentEnrolledCourseService = {
  createStudentEnrolledCourse,
  getAllStudentEnrolledCourses,
  getSingleStudentEnrolledCourse,
  deleteSingleStudentEnrolledCourse,
  updateSingleStudentEnrolledCourse,
};
