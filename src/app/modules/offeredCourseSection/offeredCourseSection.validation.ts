import { z } from 'zod';

const createOfferedCourseSectionZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is Required',
    }),
    maxCapacity: z.number({
      required_error: 'Title is Required',
    }),
    offeredCourseId: z.string({
      required_error: 'Offered Course Id is Required',
    }),
  }),
});
const updateOfferedCourseSectionZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    maxCapacity: z.number().optional(),
    semesterRegistrationId: z.string().optional(),
    offeredCourseId: z.string().optional(),
  }),
});

export const OfferedCourseSectionValidation = {
  createOfferedCourseSectionZodSchema,
  updateOfferedCourseSectionZodSchema,
};
