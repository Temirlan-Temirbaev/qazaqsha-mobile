import { Assignment } from './assignment';
import { Course } from './course';
import {Question} from "./question";

export class Test extends Assignment {
  course: Course;
  questions: Question[];
}
