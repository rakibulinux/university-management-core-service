import express from 'express';
import { AcademicDepartmentRouter } from '../modules/AcademicDepartment/academicDepartment.route';
import { AcademicFacultyRouter } from '../modules/AcademicFaculty/academicFaculty.route';
import { FacultyRouter } from '../modules/Faculty/faculty.route';
import { StudentRouter } from '../modules/Student/student.route';
import { AcademicSemesterRouter } from '../modules/academicSemester/academicSemester.route';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
