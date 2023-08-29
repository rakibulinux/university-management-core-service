import { OfferedCourse, Prisma } from '@prisma/client';

import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { offeredCourseSearchableFields } from './offeredCourses.constant';
import {
  ICreateOfferedCourse,
  IOfferedCourseFilterRequest,
} from './offeredCourses.interface';

const createOfferedCourse = async (
  data: ICreateOfferedCourse
): Promise<OfferedCourse[]> => {
  const { academicDepartmentId, semesterRegistrationId, courseIds } = data;
  const result: OfferedCourse[] = [];

  await asyncForEach(courseIds, async (courseId: string) => {
    const alreadyExsist = await prisma.offeredCourse.findFirst({
      where: {
        academicDepartmentId,
        semesterRegistrationId,
        courseId,
      },
    });
    if (!alreadyExsist) {
      const insertOfferedCourse = await prisma.offeredCourse.create({
        data: {
          academicDepartmentId,
          semesterRegistrationId,
          courseId,
        },
        include: {
          academicDepartment: true,
          semesterRegistration: true,
          course: true,
        },
      });
      result.push(insertOfferedCourse);
    }
  });
  return result;
};

const getAllOfferedCourses = async (
  filters: IOfferedCourseFilterRequest,
  pagination: IPaginationOptions
): Promise<IGenericResponse<OfferedCourse[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);
  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      OR: offeredCourseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.OfferedCourseWhereInput =
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

  const result = await prisma.offeredCourse.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
    include: {
      academicDepartment: true,
      semesterRegistration: true,
      course: true,
    },
  });

  const total = await prisma.offeredCourse.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleOfferedCourse = async (id: string) => {
  const result = await prisma.offeredCourse.findUnique({
    where: {
      id,
    },
    include: {
      academicDepartment: true,
      semesterRegistration: true,
      course: true,
    },
  });
  return result;
};
const updateSingleOfferedCourse = async (
  id: string,
  data: Partial<OfferedCourse>
): Promise<OfferedCourse> => {
  const result = await prisma.offeredCourse.update({
    where: {
      id,
    },
    data,
    include: {
      academicDepartment: true,
      semesterRegistration: true,
      course: true,
    },
  });
  return result;
};
const deleteSingleOfferedCourse = async (
  id: string
): Promise<OfferedCourse> => {
  const result = await prisma.offeredCourse.delete({
    where: {
      id,
    },
  });
  return result;
};

export const OfferedCourseService = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateSingleOfferedCourse,
  deleteSingleOfferedCourse,
};
