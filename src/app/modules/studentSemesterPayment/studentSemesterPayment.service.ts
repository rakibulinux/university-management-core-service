import { Prisma, PrismaClient, StudentSemesterPayment } from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { studentSemesterPaymentSearchableFields } from './studentSemesterPayment.constant';
import { IStudentSemesterPaymentFilterRequest } from './studentSemesterPayment.interface';

const createSemesterPayment = async (
  transactionClient: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: {
    studentId: string;
    academicSemesterId: string;
    totalPaymentAmount: number;
  }
) => {
  const isExsists = await transactionClient.studentSemesterPayment.findFirst({
    where: {
      student: {
        id: payload.studentId,
      },
      academicSemester: {
        id: payload.academicSemesterId,
      },
    },
  });
  if (!isExsists) {
    const dataToInsert = {
      studentId: payload.studentId,
      academicSemesterId: payload.academicSemesterId,
      fullPaymentAmount: payload.totalPaymentAmount,
      partialPaymentAmount: payload.totalPaymentAmount * 0.5,
      totalDueAmount: payload.totalPaymentAmount,
      totalPaidAmount: 0,
    };
    await transactionClient.studentSemesterPayment.create({
      data: dataToInsert,
    });
  }
};

const getAllStudentSemesterPayments = async (
  filters: IStudentSemesterPaymentFilterRequest,
  pagination: IPaginationOptions
): Promise<IGenericResponse<StudentSemesterPayment[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);
  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      OR: studentSemesterPaymentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.StudentSemesterPaymentWhereInput =
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

  const result = await prisma.studentSemesterPayment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.studentSemesterPayment.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleStudentSemesterPayment = async (id: string) => {
  const result = await prisma.studentSemesterPayment.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateSingleStudentSemesterPayment = async (
  id: string,
  data: Partial<StudentSemesterPayment>
): Promise<StudentSemesterPayment> => {
  const result = await prisma.studentSemesterPayment.update({
    where: {
      id,
    },
    data,
  });
  return result;
};
const deleteSingleStudentSemesterPayment = async (
  id: string
): Promise<StudentSemesterPayment> => {
  const result = await prisma.studentSemesterPayment.delete({
    where: {
      id,
    },
  });
  return result;
};

export const StudentSemesterPaymentService = {
  createSemesterPayment,
  getAllStudentSemesterPayments,
  getSingleStudentSemesterPayment,
  deleteSingleStudentSemesterPayment,
  updateSingleStudentSemesterPayment,
};
