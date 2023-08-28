import { z } from 'zod';
import { semesterRegistrationEnums } from './semesterRegistration.constant';

const createSemesterRegistrationZodSchema = z.object({
  body: z.object({
    startDate: z.string({
      required_error: 'Start Date is required',
    }),
    endDate: z.string({
      required_error: 'End Date is required',
    }),
    status: z.enum([...semesterRegistrationEnums] as [string, ...string[]], {
      required_error: 'Status is required',
    }),
    minCredit: z.number({
      required_error: 'Min Credit is required',
    }),
    maxCredit: z.number({
      required_error: 'Max Credit is required',
    }),
    academicSemesterId: z.string({
      required_error: 'Academic Semester Id is Required',
    }),
  }),
});
const updateSemesterRegistrationZodSchema = z.object({
  body: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z
      .enum([...semesterRegistrationEnums] as [string, ...string[]])
      .optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
    academicSemesterId: z.string().optional(),
  }),
});

export const SemesterRegistrationValidation = {
  createSemesterRegistrationZodSchema,
  updateSemesterRegistrationZodSchema,
};
