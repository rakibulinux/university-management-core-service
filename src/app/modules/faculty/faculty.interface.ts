import { Course, OfferedCourseClassSchedule } from '@prisma/client';

export type IFacultyFilterRequest = {
  searchTerm?: string | undefined;
  academicFacultyId?: string | undefined;
  academicDepartmentId?: string | undefined;
  studentId?: string | undefined;
  email?: string | undefined;
  contactNo?: string | undefined;
  gender?: string | undefined;
  bloodGroup?: string | undefined;
};

type OfferedCourse = {
  id: string;
  createdAt: Date; // This should be a date string, adjust as needed
  updatedAt: Date; // This should be a date string, adjust as needed
  courseId: string;
  academicDepartmentId: string;
  semesterRegistrationId: string;
  course: Course;
};

export type IOfferedCourseSection = {
  id: string;
  title: string;
  maxCapacity: number;
  currentlyEnrolledStudent: number;
  createdAt: Date; // This should be a date string, adjust as needed
  updatedAt: Date; // This should be a date string, adjust as needed
  offeredCourseId: string;
  semesterRegistrationId: string;
  offeredCourse: OfferedCourse;
  course?: Course;
  offeredCourseClassSchedules: OfferedCourseClassSchedule[];
  sections?: {
    section: IOfferedCourseSection;
    classSchedules: OfferedCourseClassSchedule[];
  }[];
};

export type UserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type IFaculty = {
  id: string;
  name: UserName;
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  bloodGroup?: BloodGroup;
  designation: string;
  academicDepartment: string;
  academicFaculty: string;
  profileImage?: string;
};
