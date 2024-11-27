import { User } from './user';
import { Lesson } from './lesson';
import { Test } from './test';
import {CourseProgress} from "./courseProgress";

export class Course {
  course_id: string;
  name: string;
  students: User[];
  lessons: Lesson[];
  courseProgress: CourseProgress[];
  tests: Test[];
  level : "A1" | "A2" | "B1" | "B2"
}
