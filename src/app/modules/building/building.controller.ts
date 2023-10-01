import { Building } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { buildingFilterableFields } from './building.constant';
import { BuildingService } from './building.service';

const createBuilding = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.createBuilding(req.body);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building Created!',
    data: result,
  });
});
const getAllBuildings = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingFilterableFields);
  const pagination = pick(req.query, paginationFields);
  const result = await BuildingService.getAllBuildings(filters, pagination);

  sendResponse<Building[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get All Building Successfully!',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleBuilding = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.getSingleBuilding(req.params.id);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${
      result
        ? 'Get A Single Building Successfully!'
        : `No Building Find For This ID: ${req.params.id}`
    }`,
    data: result,
  });
});
const updateSingleBuilding = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.updateSingleBuilding(
    req.params.id,
    req.body
  );
  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update A Single Building Successfully!',
    data: result,
  });
});
const deleteSingleBuilding = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.deleteSingleBuilding(req.params.id);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delete A Single Building Successfully!',
    data: result,
  });
});

export const BuildingController = {
  createBuilding,
  getAllBuildings,
  getSingleBuilding,
  updateSingleBuilding,
  deleteSingleBuilding,
};
