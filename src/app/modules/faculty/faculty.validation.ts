import { z } from 'zod';
import { bloodGroup, gender } from './faculty.constant';
const createFacultyZodSchema = z.object({
  body: z.object({
    facultyId: z.string({
      required_error: 'faculty id is required',
    }),
    firstName: z.string({
      required_error: 'First name is required',
    }),
    lastName: z.string({
      required_error: 'Last name is required',
    }),
    middleName: z.string({
      required_error: 'Middle name is required',
    }),
    profileImage: z.string({
      required_error: 'Profile image is required',
    }),
    email: z.string({
      required_error: 'Email is required',
    }),
    contactNo: z.string({
      required_error: 'Contact no is required',
    }),
    gender: z.enum([...gender] as [string, ...string[]], {
      required_error: 'Gender is required',
    }),
    bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),
    designation: z.string({
      required_error: 'Designation is required',
    }),
    academicDepartmentId: z.string({
      required_error: 'Academic department is required',
    }),
    academicFacultyId: z.string({
      required_error: 'Academic faculty is required',
    }),
  }),
});
const updateFacultyZodSchema = z.object({
  body: z.object({
    facultyId: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    profileImage: z.string().optional(),
    email: z.string().optional(),
    contactNo: z.string().optional(),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    designation: z.string().optional(),
    academicDepartmentId: z.string().optional(),
    academicFacultyId: z.string().optional(),
  }),
});

const assignOrRemoveCoursesZodValidation = z.object({
  body: z.object({
    courses: z.array(z.string(), {
      required_error: 'Courses ID is Required',
    }),
  }),
});

export const FacultyValidation = {
  updateFacultyZodSchema,
  createFacultyZodSchema,
  assignOrRemoveCoursesZodValidation,
};
