import { OfferedCourseSection, Prisma } from '@prisma/client';

import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { offeredCourseSectionSearchableFields } from './offeredCourseSection.constant';
import { IOfferedCourseSectionFilterRequest } from './offeredCourseSection.interface';

const createOfferedCourseSection = async (
  data: any
): Promise<OfferedCourseSection> => {
  const isExsistsOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: data.offeredCourseId,
    },
  });
  if (!isExsistsOfferedCourse) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Offered Course does not exsist'
    );
  }
  data.semesterRegistrationId = isExsistsOfferedCourse.semesterRegistrationId;
  const result = await prisma.offeredCourseSection.create({
    data,
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });
  return result;
};

const getAllOfferedCourseSections = async (
  filters: IOfferedCourseSectionFilterRequest,
  pagination: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseSection[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);
  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      OR: offeredCourseSectionSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.OfferedCourseSectionWhereInput =
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

  const result = await prisma.offeredCourseSection.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });

  const total = await prisma.offeredCourseSection.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleOfferedCourseSection = async (id: string) => {
  const result = await prisma.offeredCourseSection.findUnique({
    where: {
      id,
    },
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });
  return result;
};
const updateSingleOfferedCourseSection = async (
  id: string,
  data: Partial<OfferedCourseSection>
): Promise<OfferedCourseSection> => {
  const result = await prisma.offeredCourseSection.update({
    where: {
      id,
    },
    data,
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });
  return result;
};
const deleteSingleOfferedCourseSection = async (
  id: string
): Promise<OfferedCourseSection> => {
  const result = await prisma.offeredCourseSection.delete({
    where: {
      id,
    },
  });
  return result;
};

export const OfferedCourseSectionService = {
  createOfferedCourseSection,
  getAllOfferedCourseSections,
  getSingleOfferedCourseSection,
  updateSingleOfferedCourseSection,
  deleteSingleOfferedCourseSection,
};
