import { OfferedCourseSection } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { offeredCourseSectionFilterableFields } from './offeredCourseSection.constant';
import { OfferedCourseSectionService } from './offeredCourseSection.service';

const createOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseSectionService.createOfferedCourseSection(
      req.body
    );
    console.log(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Offered Course Created successufully!
      `,
      data: result,
    });
  }
);
const getAllOfferedCourseSections = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, offeredCourseSectionFilterableFields);
    const pagination = pick(req.query, paginationFields);
    const result =
      await OfferedCourseSectionService.getAllOfferedCourseSections(
        filters,
        pagination
      );

    sendResponse<OfferedCourseSection[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get All OfferedCourseSection Successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);
const getSingleOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await OfferedCourseSectionService.getSingleOfferedCourseSection(
        req.params.id
      );

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${
        result
          ? 'Get A Single OfferedCourseSection Successfully!'
          : `No OfferedCourseSection Find For This ID: ${req.params.id}`
      }`,
      data: result,
    });
  }
);
const updateSingleOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await OfferedCourseSectionService.updateSingleOfferedCourseSection(
        req.params.id,
        req.body
      );
    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Update A Single OfferedCourseSection Successfully!',
      data: result,
    });
  }
);
const deleteSingleOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await OfferedCourseSectionService.deleteSingleOfferedCourseSection(
        req.params.id
      );

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Delete A Single Offered Course Section Successfully!',
      data: result,
    });
  }
);

export const OfferedCourseSectionController = {
  createOfferedCourseSection,
  getAllOfferedCourseSections,
  getSingleOfferedCourseSection,
  updateSingleOfferedCourseSection,
  deleteSingleOfferedCourseSection,
};
