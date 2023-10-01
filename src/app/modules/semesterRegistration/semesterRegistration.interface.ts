export type ISemesterRegistrationEnums = 'UPCOMING' | 'ONGOING' | 'ENDED';
export type ISemesterRegistrationFilterRequest = {
  searchTerm?: string | undefined;
};

export type IEnrollCoursePayload = {
  offeredCourseId: string;
  offeredCourseSectionId: string;
};
