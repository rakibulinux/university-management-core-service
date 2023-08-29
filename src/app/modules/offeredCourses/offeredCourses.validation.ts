import { z } from 'zod';

const createOfferedCourseZodSchema = z.object({
  body: z.object({
    academicDepartmentId: z.string({
      required_error: 'Academic Department Id is Required',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester Registration Id is Required',
    }),
    courseIds: z.array(z.string(), {
      required_error: 'Course Ids is Required',
    }),
  }),
});
const updateOfferedCourseZodSchema = z.object({
  body: z.object({
    academicDepartmentId: z.string().optional(),
    semesterRegistrationId: z.string().optional(),
    courseIds: z.string().optional(),
  }),
});

export const OfferedCourseValidation = {
  createOfferedCourseZodSchema,
  updateOfferedCourseZodSchema,
};
