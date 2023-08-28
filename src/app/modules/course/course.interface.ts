export type IPrerequisiteCourseRequest = {
  courseId: string;
  isDeleted?: null;
};

export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: IPrerequisiteCourseRequest[];
};
type PreRequisiteItem = {
  preRequisite: {
    id: string;
    title: string;
    code: string;
    credits: number;
    createdAt: Date;
    updatedAt: Date;
  };
  courseId: string;
  preRequisiteId: string;
};

type PreRequisiteForItem = {
  courseId: string;
  preRequisiteId: string;
};
export type ICourseCreateReturn = {
  preRequisite: PreRequisiteItem[];
  preRequisiteFor: PreRequisiteForItem[];
  id: string;
  title: string;
  code: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
} | null;

export type ICourseFilterRequest = {
  searchTerm?: string | undefined;
};
