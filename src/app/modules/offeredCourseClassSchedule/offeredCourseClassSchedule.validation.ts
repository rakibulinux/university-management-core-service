import { WeekDays } from '@prisma/client';
import { z } from 'zod';

// Convert Prisma enum values to an array of strings
const weekDayEnumValues = Object.values(WeekDays).filter(
  value => typeof value === 'string'
);

const createOfferedCourseClassScheduleZodSchema = z.object({
  body: z.object({
    startTime: z.string({
      required_error: 'Start Time is Required',
    }),
    endTime: z.string({
      required_error: 'End Time is Required',
    }),
    dayOfWeek: z.enum([...weekDayEnumValues] as [string, ...string[]], {
      required_error: 'Title is Required',
    }),
    offeredCourseSectionId: z.string({
      required_error: 'Offered Course Section Id is Required',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester Registration Id is Required',
    }),
    roomId: z.string({
      required_error: 'Room Id is Required',
    }),
    facultyId: z.string({
      required_error: 'Offered Course Section Id is Required',
    }),
  }),
});
const updateOfferedCourseClassScheduleZodSchema = z.object({
  body: z.object({
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    dayOfWeek: z
      .enum([...weekDayEnumValues] as [string, ...string[]])
      .optional(),
    offeredCourseSectionId: z.string().optional(),
    semesterRegistrationId: z.string().optional(),
    roomId: z.string().optional(),
    facultyId: z.string().optional(),
  }),
});

export const OfferedCourseClassScheduleValidation = {
  createOfferedCourseClassScheduleZodSchema,
  updateOfferedCourseClassScheduleZodSchema,
};
