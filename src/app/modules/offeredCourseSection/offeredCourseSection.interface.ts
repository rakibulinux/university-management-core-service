export type IOfferedCourseSectionFilterRequest = {
  searchTerm?: string | undefined;
};

export type ICreateOfferedCourseSection = {
  academicDepartmentId: string;
  semesterRegistrationId: string;
  courseIds: string[];
};
