import { Prisma, Student } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { studentSearchableFields } from './student.constant';
import { IStudentFilterRequest } from './student.interface';

const insertIntoDB = async (data: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data,
  });
  return result;
};

const getAllStudents = async (
  filters: IStudentFilterRequest,
  pagination: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);
  console.log(filtersData);
  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      OR: studentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.StudentWhereInput =
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

  const result = await prisma.student.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.student.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleStudent = async (id: string) => {
  console.log(id);
  const result = await prisma.student.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateSingleStudent = async (
  id: string,
  data: Partial<Student>
): Promise<Student> => {
  const result = await prisma.student.update({
    where: {
      id,
    },
    data,
  });
  return result;
};
const deleteSingleStudent = async (id: string): Promise<Student> => {
  const result = await prisma.student.delete({
    where: {
      id,
    },
  });
  return result;
};

export const StudentService = {
  insertIntoDB,
  getAllStudents,
  getSingleStudent,
  updateSingleStudent,
  deleteSingleStudent,
};