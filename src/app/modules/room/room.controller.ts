import { Room } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { roomFilterableFields } from './room.constant';
import { RoomService } from './room.service';

const createRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await RoomService.createRoom(req.body);

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room Created!',
    data: result,
  });
});
const getAllRooms = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, roomFilterableFields);
  const pagination = pick(req.query, paginationFields);
  const result = await RoomService.getAllRooms(filters, pagination);

  sendResponse<Room[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get All Room Successfully!',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await RoomService.getSingleRoom(req.params.id);

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${
      result
        ? 'Get A Single Room Successfully!'
        : `No Room Find For This ID: ${req.params.id}`
    }`,
    data: result,
  });
});
const updateSingleRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await RoomService.updateSingleRoom(req.params.id, req.body);
  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update A Single Room Successfully!',
    data: result,
  });
});
const deleteSingleRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await RoomService.deleteSingleRoom(req.params.id);

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delete A Single Room Successfully!',
    data: result,
  });
});

export const RoomController = {
  createRoom,
  getAllRooms,
  getSingleRoom,
  updateSingleRoom,
  deleteSingleRoom,
};
