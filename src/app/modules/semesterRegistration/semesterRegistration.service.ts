import {
  Course,
  OfferedCourse,
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
  StudentSemesterRegistrationCourse,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { StudentEnrolledCourseMarkService } from '../studentEnrolledCourseMark/studentEnrolledCourseMark.service';
import { StudentSemesterPaymentService } from '../studentSemesterPayment/studentSemesterPayment.service';
import { StudentSemesterRegistrationCourseService } from '../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.service';
import { semesterRegistrationSearchableFields } from './semesterRegistration.constant';
import {
  IEnrollCoursePayload,
  ISemesterRegistrationFilterRequest,
} from './semesterRegistration.interface';
import { SemesterRegistrationUtils } from './semesterRegistration.utils';

const createSemesterRegistration = async (
  data: SemesterRegistration,
): Promise<SemesterRegistration> => {
  const isAnySemesterRegistrationUpcomingOrOngoing =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });
  if (isAnySemesterRegistrationUpcomingOrOngoing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isAnySemesterRegistrationUpcomingOrOngoing.status} registration`,
    );
  }
  const result = await prisma.semesterRegistration.create({
    data,
    include: {
      academicSemester: true,
    },
  });
  return result;
};

const enrollIntoCourse = async (
  authUserId: string,
  payload: IEnrollCoursePayload,
): Promise<{ message: string }> => {
  return StudentSemesterRegistrationCourseService.enrollIntoCourse(
    authUserId,
    payload,
  );
};
const withdrawFromCourse = async (
  authUserId: string,
  payload: IEnrollCoursePayload,
) => {
  return StudentSemesterRegistrationCourseService.withdrawFromCourse(
    authUserId,
    payload,
  );
};

const confirmMyRegistration = async (
  authUserId: string,
): Promise<{ message: string }> => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: 'ONGOING',
    },
  });

  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
    });

  if (!studentSemesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not recognized for this semester!',
    );
  }

  if (studentSemesterRegistration.totalCreditsTaken === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not enrolled any message',
    );
  }

  if (
    studentSemesterRegistration.totalCreditsTaken &&
    semesterRegistration?.minCredit &&
    semesterRegistration.maxCredit &&
    (studentSemesterRegistration.totalCreditsTaken <
      semesterRegistration?.minCredit ||
      studentSemesterRegistration.totalCreditsTaken >
        semesterRegistration?.maxCredit)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can take only ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit}`,
    );
  }

  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistration.id,
    },
    data: {
      isConfirmed: true,
    },
  });
  return {
    message: 'Your registration is confirmed',
  };
};
const getMyRegistration = async (authUserId: string) => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: 'ONGOING',
    },
  });

  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
    });

  return {
    semesterRegistration,
    studentSemesterRegistration,
  };
};

const createStartMyRegistration = async (
  authUserId: string,
): Promise<{
  semesterRegistration: SemesterRegistration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  if (!studentInfo) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Student info not found for this id ${authUserId}`,
    );
  }

  const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: ['ONGOING', 'UPCOMING'],
      },
    },
  });

  if (semesterRegistrationInfo?.status === 'UPCOMING') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Registration is not started yet',
    );
  }

  let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      student: {
        id: studentInfo?.id,
      },
      semesterRegistration: {
        id: semesterRegistrationInfo?.id,
      },
    },
  });
  if (!studentRegistration) {
    studentRegistration = await prisma.studentSemesterRegistration.create({
      data: {
        student: {
          connect: {
            id: studentInfo?.id,
          },
        },
        semesterRegistration: {
          connect: {
            id: semesterRegistrationInfo?.id,
          },
        },
      },
    });
  }

  // const result = await prisma.semesterRegistration.create({
  //   studentInfo,
  //   include: {
  //     academicSemester: true,
  //   },
  // });
  return {
    semesterRegistration: semesterRegistrationInfo,
    studentSemesterRegistration: studentRegistration,
  };
};

const getAllSemesterRegistrations = async (
  filters: ISemesterRegistrationFilterRequest,
  pagination: IPaginationOptions,
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);
  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      OR: semesterRegistrationSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.SemesterRegistrationWhereInput =
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

  const result = await prisma.semesterRegistration.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
    include: {
      academicSemester: true,
    },
  });

  const total = await prisma.semesterRegistration.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleSemesterRegistration = async (id: string) => {
  const result = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
  return result;
};
const updateSingleSemesterRegistration = async (
  id: string,
  data: Partial<SemesterRegistration>,
): Promise<SemesterRegistration> => {
  const isExsists = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  if (!isExsists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Data not found for this id');
  }
  if (
    data.status &&
    isExsists.status === 'UPCOMING' &&
    data.status !== 'ONGOING'
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from Upcoming to Ongoing',
    );
  }
  if (
    data.status &&
    isExsists.status === 'ONGOING' &&
    data.status !== 'ENDED'
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from Ongoing to Ended',
    );
  }

  const result = await prisma.semesterRegistration.update({
    where: {
      id,
    },
    data,
    include: {
      academicSemester: true,
    },
  });
  return result;
};
const deleteSingleSemesterRegistration = async (
  id: string,
): Promise<SemesterRegistration> => {
  const result = await prisma.semesterRegistration.delete({
    where: {
      id,
    },
  });
  return result;
};

const startNewSemester = async (
  id: string,
): Promise<{
  message: string;
}> => {
  const semesterRegistration = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Semester Registration not found`,
    );
  }
  if (semesterRegistration.status !== 'ENDED') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Semester Registration is not ended yet!`,
    );
  }
  // if (semesterRegistration.academicSemester.isCurrent) {
  //   throw new ApiError(
  //     httpStatus.BAD_REQUEST,
  //     `Semester Registration already running!`
  //   );
  // }
  await prisma.$transaction(async transactionClient => {
    await transactionClient.academicSemester.updateMany({
      where: {
        isCurrent: true,
      },

      data: {
        isCurrent: false,
      },
    });
    await transactionClient.academicSemester.update({
      where: {
        id: semesterRegistration.academicSemesterId,
      },
      data: {
        isCurrent: true,
      },
    });
    const studentSemesterRegistrations =
      await transactionClient.studentSemesterRegistration.findMany({
        where: {
          semesterRegistration: {
            id,
          },
          isConfirmed: true,
        },
      });

    await asyncForEach(
      studentSemesterRegistrations,
      async (studentSemReg: StudentSemesterRegistration) => {
        if (studentSemReg.totalCreditsTaken) {
          const totalPaymentAmount = studentSemReg.totalCreditsTaken * 5000;
          await StudentSemesterPaymentService.createSemesterPayment(
            transactionClient,
            {
              studentId: studentSemReg.studentId,
              academicSemesterId: semesterRegistration.academicSemesterId,
              totalPaymentAmount: totalPaymentAmount,
            },
          );
        }
        const studentSemesterRegistrationCourse =
          await transactionClient.studentSemesterRegistrationCourse.findMany({
            where: {
              semesterRegistration: {
                id,
              },
              student: {
                id: studentSemReg.studentId,
              },
            },
            include: {
              offeredCourse: {
                include: {
                  course: true,
                },
              },
            },
          });

        await asyncForEach(
          studentSemesterRegistrationCourse,
          async (
            item: StudentSemesterRegistrationCourse & {
              offeredCourse: OfferedCourse & {
                course: Course;
              };
            },
          ) => {
            const isExsistsEnrolledData =
              await transactionClient.studentEnrolledCourse.findFirst({
                where: {
                  studentId: item.studentId,
                  courseId: item.offeredCourse.courseId,
                  academicSemesterId: semesterRegistration.academicSemesterId,
                },
              });

            if (!isExsistsEnrolledData) {
              const enrolledCourseData = {
                studentId: item.studentId,
                courseId: item.offeredCourse.courseId,
                academicSemesterId: semesterRegistration.academicSemesterId,
              };
              const studentEnrolledCourseData =
                await transactionClient.studentEnrolledCourse.create({
                  data: enrolledCourseData,
                });

              await StudentEnrolledCourseMarkService.createStudentCourseDefaultMark(
                transactionClient,
                {
                  studentId: item.studentId,
                  studentEnrolledCourseId: studentEnrolledCourseData.id,
                  academicSemesterId: semesterRegistration.academicSemesterId,
                },
              );
            }
          },
        );
      },
    );
  });

  return {
    message: 'Semester Started Successfuly!',
  };
};

const getMySemesterRegistration = async (authUserId: string) => {
  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.UPCOMING,
          SemesterRegistrationStatus.ONGOING,
        ],
      },
    },
    include: {
      academicSemester: true,
    },
  });
  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'No Semester Registration Not Found',
    );
  }
  const studentCompletedCourse = await prisma.studentEnrolledCourse.findMany({
    where: {
      status: 'COMPLETED',
      student: {
        id: student?.id,
      },
    },
    include: {
      course: true,
    },
  });
  const studentCurrentSemesterTakenCourse =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        student: {
          id: student?.id,
        },
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
      },
      include: {
        offeredCourse: true,
        offeredCourseSection: true,
      },
    });
  const offeredCourse = await prisma.offeredCourse.findMany({
    where: {
      semesterRegistration: {
        id: semesterRegistration.id,
      },
      academicDepartment: {
        id: student?.academicDepartmentId,
      },
    },
    include: {
      course: {
        include: {
          preRequisite: {
            include: {
              preRequisite: true,
            },
          },
        },
      },
      offeredCourseSections: {
        include: {
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
      },
    },
  });
  const availableCourses = SemesterRegistrationUtils.getAvailableCourses(
    offeredCourse,
    studentCompletedCourse,
    studentCurrentSemesterTakenCourse,
  );
  return availableCourses;
};

export const SemesterRegistrationService = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSingleSemesterRegistration,
  deleteSingleSemesterRegistration,
  createStartMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester,
  getMySemesterRegistration,
};
