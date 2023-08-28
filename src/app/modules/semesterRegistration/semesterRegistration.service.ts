import {
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { semesterRegistrationSearchableFields } from './semesterRegistration.constant';
import { ISemesterRegistrationFilterRequest } from './semesterRegistration.interface';

const createSemesterRegistration = async (
  data: SemesterRegistration
): Promise<SemesterRegistration> => {
  const isAnySemesterRegistrationUpcomingOrOngoing =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });
  if (isAnySemesterRegistrationUpcomingOrOngoing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isAnySemesterRegistrationUpcomingOrOngoing.status} registration`
    );
  }
  const result = await prisma.semesterRegistration.create({
    data,
    include: {
      academicSemester: true,
    },
  });
  return result;
};

const getAllSemesterRegistrations = async (
  filters: ISemesterRegistrationFilterRequest,
  pagination: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);
  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      OR: semesterRegistrationSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.SemesterRegistrationWhereInput =
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

  const result = await prisma.semesterRegistration.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
    include: {
      academicSemester: true,
    },
  });

  const total = await prisma.semesterRegistration.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleSemesterRegistration = async (id: string) => {
  const result = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
  return result;
};
const updateSingleSemesterRegistration = async (
  id: string,
  data: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {
  const isExsists = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  if (!isExsists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Data not found for this id');
  }
  if (
    data.status &&
    isExsists.status === 'UPCOMING' &&
    data.status !== 'ONGOING'
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from Upcoming to Ongoing'
    );
  }
  if (
    data.status &&
    isExsists.status === 'ONGOING' &&
    data.status !== 'ENDED'
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from Ongoing to Ended'
    );
  }

  const result = await prisma.semesterRegistration.update({
    where: {
      id,
    },
    data,
    include: {
      academicSemester: true,
    },
  });
  return result;
};
const deleteSingleSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration> => {
  const result = await prisma.semesterRegistration.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SemesterRegistrationService = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSingleSemesterRegistration,
  deleteSingleSemesterRegistration,
};
