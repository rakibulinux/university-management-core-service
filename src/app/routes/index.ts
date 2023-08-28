import express from 'express';
import { AcademicDepartmentRouter } from '../modules/academicDepartment/academicDepartment.route';
import { AcademicFacultyRouter } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicSemesterRouter } from '../modules/academicSemester/academicSemester.route';
import { BuildingRoute } from '../modules/building/building.route';
import { CourseRoute } from '../modules/course/course.route';
import { FacultyRouter } from '../modules/faculty/faculty.route';
import { RoomRoute } from '../modules/room/room.route';
import { SemesterRegistrationRoute } from '../modules/semesterRegistration/semesterRegistration.route';
import { StudentRouter } from '../modules/student/student.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-department',
    route: AcademicDepartmentRouter,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRouter,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRouter,
  },
  {
    path: '/faculties',
    route: FacultyRouter,
  },
  {
    path: '/students',
    route: StudentRouter,
  },
  {
    path: '/buildings',
    route: BuildingRoute,
  },
  {
    path: '/rooms',
    route: RoomRoute,
  },
  {
    path: '/courses',
    route: CourseRoute,
  },
  {
    path: '/semester-registration',
    route: SemesterRegistrationRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
