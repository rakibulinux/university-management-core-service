import { AcademicDepartment, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { RedisClient } from '../../../shared/redis';
import {
  EVENT_ACADEMIC_DEPARTMENT_CREATED,
  EVENT_ACADEMIC_DEPARTMENT_DELETE,
  EVENT_ACADEMIC_DEPARTMENT_UPDATED,
  academicDepartmentSearchableFields,
} from './academicDepartment.constant';
import { IAcademicDepartmentFilters } from './academicDepartment.interface';

const insertIntoDB = async (
  data: AcademicDepartment,
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.create({
    data,
    include: {
      academicFaculty: true,
    },
  });
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_DEPARTMENT_CREATED,
      JSON.stringify(result),
    );
  }
  return result;
};

const getAllAcademicDepartments = async (
  filters: IAcademicDepartmentFilters,
  pagination: IPaginationOptions,
): Promise<IGenericResponse<AcademicDepartment[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);
  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      OR: academicDepartmentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.AcademicDepartmentWhereInput =
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

  const result = await prisma.academicDepartment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
    include: {
      academicFaculty: true,
    },
  });

  const total = await prisma.academicDepartment.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleAcademicDepartment = async (id: string) => {
  const result = await prisma.academicDepartment.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
    },
  });
  return result;
};
const updateSingleAcademicDepartment = async (
  id: string,
  data: Partial<AcademicDepartment>,
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.update({
    where: {
      id,
    },
    data,
  });
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_DEPARTMENT_UPDATED,
      JSON.stringify(result),
    );
  }
  return result;
};
const deleteSingleAcademicDepartment = async (
  id: string,
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.delete({
    where: {
      id,
    },
  });
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_DEPARTMENT_DELETE,
      JSON.stringify(result),
    );
  }
  return result;
};

export const AcademicDepartmentService = {
  insertIntoDB,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateSingleAcademicDepartment,
  deleteSingleAcademicDepartment,
};
