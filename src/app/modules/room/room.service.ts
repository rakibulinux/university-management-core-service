import { Prisma, Room } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { roomSearchableFields } from './room.constant';
import { IRoomFilterRequest } from './room.interface';

const createRoom = async (data: Room): Promise<Room> => {
  const result = await prisma.room.create({
    data,
    include: {
      building: true,
    },
  });
  return result;
};

const getAllRooms = async (
  filters: IRoomFilterRequest,
  pagination: IPaginationOptions
): Promise<IGenericResponse<Room[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);
  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      OR: roomSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.RoomWhereInput =
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

  const result = await prisma.room.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.room.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleRoom = async (id: string) => {
  const result = await prisma.room.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateSingleRoom = async (
  id: string,
  data: Partial<Room>
): Promise<Room> => {
  const result = await prisma.room.update({
    where: {
      id,
    },
    data,
  });
  return result;
};
const deleteSingleRoom = async (id: string): Promise<Room> => {
  const result = await prisma.room.delete({
    where: {
      id,
    },
  });
  return result;
};

export const RoomService = {
  createRoom,
  getAllRooms,
  getSingleRoom,
  deleteSingleRoom,
  updateSingleRoom,
};
