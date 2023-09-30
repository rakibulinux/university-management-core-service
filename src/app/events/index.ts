import initFacultyEvent from '../modules/faculty/faculty.events';
import initStudentEvent from '../modules/student/student.events';

const subscribeToEvents = () => {
  initStudentEvent();
  initFacultyEvent();
};

export default subscribeToEvents;
