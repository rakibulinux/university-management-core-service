import { OfferedCourseClassSchedule, WeekDays } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { hasConflict } from '../../../shared/utils';
type Schedule = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
};
const checkRoomAvailable = async (data: OfferedCourseClassSchedule) => {
  const alreadyBookedSlot = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: data.dayOfWeek,
      room: { id: data.roomId },
    },
  });

  const exsistingSlot = alreadyBookedSlot.map((schedule: Schedule) => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));
  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };
  if (hasConflict(exsistingSlot, newSlot)) {
    throw new ApiError(httpStatus.CONFLICT, 'Room Already Booked');
  }
};

const checkFacultyAvailable = async (data: OfferedCourseClassSchedule) => {
  const alreadyBookedSlot = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: data.dayOfWeek,
      faculty: { id: data.facultyId },
    },
  });

  const exsistingSlot = alreadyBookedSlot.map((schedule: Schedule) => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));
  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };
  if (hasConflict(exsistingSlot, newSlot)) {
    throw new ApiError(httpStatus.CONFLICT, 'Faculty Is Already Booked!');
  }
};

export const OfferedCourseClassScheduleUtils = {
  checkRoomAvailable,
  checkFacultyAvailable,
};
