export type IOfferedCourseClassScheduleFilterRequest = {
  searchTerm?: string | undefined;
};

export type ICreateOfferedCourseClassSchedule = {
  academicDepartmentId: string;
  semesterRegistrationId: string;
  courseIds: string[];
};
