import { ISemesterRegistrationEnums } from './semesterRegistration.interface';

export const semesterRegistrationSearchableFields = ['id', 'title'];
export const semesterRegistrationFilterableFields = [
  'searchTerm',
  'id',
  'roomNumber',
  'floor',
  'buildingId',
];
export const semesterRegistrationEnums: ISemesterRegistrationEnums[] = [
  'UPCOMING',
  'ONGOING',
  'ENDED',
];
