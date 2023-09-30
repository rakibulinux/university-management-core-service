import { AcademicFaculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { RedisClient } from '../../../shared/redis';
import {
  EVENT_ACADEMIC_FACULTY_CREATED,
  EVENT_ACADEMIC_FACULTY_DELETE,
  EVENT_ACADEMIC_FACULTY_UPDATED,
  academicFacultySearchableFields,
} from './academicFaculty.constant';
import { IAcademicFacultyFilters } from './academicFaculty.interface';

const insertIntoDB = async (
  data: AcademicFaculty,
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.create({
    data,
  });
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_FACULTY_CREATED,
      JSON.stringify(result),
    );
  }
  return result;
};

const getAllAcademicFaculties = async (
  filters: IAcademicFacultyFilters,
  pagination: IPaginationOptions,
): Promise<IGenericResponse<AcademicFaculty[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);
  const andConditions = [];
  // Search needs OR for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      OR: academicFacultySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.AcademicFacultyWhereInput =
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

  const result = await prisma.academicFaculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.academicFaculty.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleAcademicFaculty = async (id: string) => {
  const result = await prisma.academicFaculty.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateSingleAcademicFaculty = async (
  id: string,
  data: Partial<AcademicFaculty>,
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.update({
    where: {
      id,
    },
    data,
  });
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_FACULTY_UPDATED,
      JSON.stringify(result),
    );
  }
  return result;
};
const deleteSingleAcademicFaculty = async (
  id: string,
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.delete({
    where: {
      id,
    },
  });
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_FACULTY_DELETE,
      JSON.stringify(result),
    );
  }
  return result;
};

export const AcademicFacultyService = {
  insertIntoDB,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateSingleAcademicFaculty,
  deleteSingleAcademicFaculty,
};
