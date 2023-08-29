export type IOfferedCourseFilterRequest = {
  searchTerm?: string | undefined;
};

export type ICreateOfferedCourse = {
  academicDepartmentId: string;
  semesterRegistrationId: string;
  courseIds: string[];
};
