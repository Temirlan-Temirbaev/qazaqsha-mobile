import {Course} from "./course";
import {User} from "./user";

export class CourseProgress {
  id: string;

  user: User;

  course: Course;

  points: number;
  completed: boolean;
}