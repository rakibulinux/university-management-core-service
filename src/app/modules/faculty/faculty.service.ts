import { CourseFaculty, Faculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { facultySearchableFields } from './faculty.constant';
import {
  IFaculty,
  IFacultyFilterRequest,
  IOfferedCourseSection,
} from './faculty.interface';

const createFaculty = async (data: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data,
  });
  return result;
};

const getAllFaculties = async (
  filters: IFacultyFilterRequest,
  pagination: IPaginationOptions,
): Promise<IGenericResponse<Faculty[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);
  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      OR: facultySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: string } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await prisma.faculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.faculty.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFaculty = async (id: string) => {
  const result = await prisma.faculty.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const myCourses = async (
  authUserId: { userId: string; role: string },
  filters: {
    academicSemesterId: string | undefined | null;
    courseId: string | undefined | null;
  },
) => {
  console.log(authUserId);
  if (!filters.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    filters.academicSemesterId = currentSemester?.id;
  }
  const offeredCourseSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          faculty: {
            facultyId: authUserId.userId,
          },
        },
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemester: {
            id: filters.academicSemesterId,
          },
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
        },
      },
    },
  });
  // const courseAndSchedule = offeredCourseSections.reduce(
  //   (acc: IOfferedCourseSection[], obj: IOfferedCourseSection) => {
  //     const course = obj.offeredCourse.course;
  //     const classSchedules = obj.offeredCourseClassSchedules;

  //     const existingCourse = acc.find(
  //       (item: IOfferedCourseSection) => item?.course?.id === course.id,
  //     );

  //     if (existingCourse) {
  //       if (!existingCourse.sections) {
  //         existingCourse.sections = [];
  //       }
  //       existingCourse.sections.push({
  //         section: obj,
  //         classSchedules: classSchedules, // Ensure classSchedules matches the expected type
  //       });
  //     } else {
  //       // Create a new IOfferedCourseSection object with the required properties
  //       const newCourseSection: IOfferedCourseSection = {
  //         id: obj.id,
  //         title: obj.title,
  //         maxCapacity: obj.maxCapacity,
  //         currentlyEnrolledStudent: obj.currentlyEnrolledStudent,
  //         createdAt: obj.createdAt,
  //         updatedAt: obj.updatedAt,
  //         offeredCourseId: obj.offeredCourseId,
  //         semesterRegistrationId: obj.semesterRegistrationId,
  //         offeredCourse: obj.offeredCourse,
  //         offeredCourseClassSchedules: classSchedules, // Ensure classSchedules matches the expected type
  //         sections: obj.sections, // Initialize sections as an empty array
  //       };
  //       console.log(newCourseSection.sections);
  //       acc.push(newCourseSection);
  //     }
  //     return acc;
  //   },
  //   [],
  // );

  const courseAndSchedule: IOfferedCourseSection[] =
    offeredCourseSections.reduce(
      (acc: IOfferedCourseSection[], obj: IOfferedCourseSection) => {
        console.log('I am obj', obj);
        console.log('I am acc', acc);

        const course = obj.offeredCourse.course;
        const classSchedules = obj.offeredCourseClassSchedules;

        const exsistingCourse = acc.find(
          (item: IOfferedCourseSection) => item.course?.id === course.id,
        );

        if (exsistingCourse) {
          exsistingCourse?.sections?.push({
            section: obj,
            classSchedules,
          });
        } else {
          acc.push({
            course,
            sections: [
              {
                section: obj,
                classSchedules,
              },
            ],
            id: obj.id,
            title: obj.title,
            maxCapacity: obj.maxCapacity,
            currentlyEnrolledStudent: obj.currentlyEnrolledStudent,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
            offeredCourseId: obj.offeredCourseId,
            semesterRegistrationId: obj.semesterRegistrationId,
            offeredCourse: {
              id: obj.offeredCourse.id,
              createdAt: obj.offeredCourse.createdAt,
              updatedAt: obj.offeredCourse.updatedAt,
              courseId: obj.offeredCourse.courseId,
              academicDepartmentId: obj.offeredCourse.academicDepartmentId,
              semesterRegistrationId: obj.offeredCourse.semesterRegistrationId,
              course: {
                id: obj.offeredCourse.course.id,
                title: obj.offeredCourse.course.title,
                code: obj.offeredCourse.course.code,
                credits: obj.offeredCourse.course.credits,
                createdAt: obj.offeredCourse.course.createdAt,
                updatedAt: obj.offeredCourse.course.updatedAt,
              },
            },
            offeredCourseClassSchedules: obj.offeredCourseClassSchedules,
          });
        }
        return acc;
      },
      [],
    );

  return courseAndSchedule;
};
const updateSingleFaculty = async (
  id: string,
  data: Partial<Faculty>,
): Promise<Faculty> => {
  const result = await prisma.faculty.update({
    where: {
      id,
    },
    data,
  });
  return result;
};
const deleteSingleFaculty = async (id: string): Promise<Faculty> => {
  const result = await prisma.faculty.delete({
    where: {
      id,
    },
  });
  return result;
};

const assignCourses = async (
  id: string,
  payload: string[],
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(courseId => ({
      facultyId: id,
      courseId: courseId,
    })),
  });
  const assignFacultiesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });
  return assignFacultiesData;
};
const removeAssignCourses = async (
  id: string,
  payload: string[],
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: id,
      courseId: {
        in: payload,
      },
    },
  });
  const assignCoursesData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });
  return assignCoursesData;
};

const createFacultyFromEvent = async (e: any) => {
  console.log('createFacultyFromEvent', e);
  const facultyData: Partial<Faculty> = {
    facultyId: e.id,
    firstName: e.name.firstName,
    lastName: e.name.lastName,
    middleName: e.name.middleName,
    profileImage: e.profileImage,
    email: e.email,
    contactNo: e.contactNo,
    gender: e.gender,
    bloodGroup: e.bloodGroup,
    designation: e.designation,
    academicDepartmentId: e.academicDepartment.syncId,
    academicFacultyId: e.academicFaculty.syncId,
  };
  await createFaculty(facultyData as Faculty);
  console.log('facultyData', facultyData);
};

const updateFacultyFromEvent = async (e: any): Promise<void> => {
  const isExsist = await prisma.faculty.findFirst({
    where: {
      facultyId: e.id,
    },
  });
  if (!isExsist) {
    createFacultyFromEvent(e);
  } else {
    const facultyData: Partial<Faculty> = {
      facultyId: e.id,
      firstName: e.name.firstName,
      lastName: e.name.lastName,
      middleName: e.name.middleName,
      profileImage: e.profileImage,
      email: e.email,
      contactNo: e.contactNo,
      gender: e.gender,
      bloodGroup: e.bloodGroup,
      designation: e.designation,
      academicDepartmentId: e.academicDepartment.syncId,
      academicFacultyId: e.academicFaculty.syncId,
    };
    const res = await prisma.faculty.updateMany({
      where: {
        facultyId: e.id,
      },
      data: facultyData,
    });
    console.log(res);
  }
};

export const FacultyService = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateSingleFaculty,
  deleteSingleFaculty,
  removeAssignCourses,
  assignCourses,
  myCourses,
  updateFacultyFromEvent,
  createFacultyFromEvent,
};
