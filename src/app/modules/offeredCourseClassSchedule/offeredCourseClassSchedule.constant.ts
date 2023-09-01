export const offeredCourseClassScheduleSearchableFields = ['id', 'courseId'];
export const offeredCourseClassScheduleFilterableFields = [
  'searchTerm',
  'id',
  'roomNumber',
  'floor',
  'buildingId',
];
export const offeredCourseClassScheduleRelationFields = [
  'offeredCourseSectionId',
  'semesterRegistrationId',
  'roomId',
  'facultyId',
];
export const offeredCourseClassScheduleRelationMapper: {
  [key: string]: string;
} = {
  offeredCourseSectionId: 'offeredCourseSection',
  semesterRegistrationId: 'semesterRegistration',
  roomId: 'room',
  facultyId: 'faculty',
};
