import { Course } from './course';
import { Quiz } from './quiz';

export class Lesson {
  lesson_id: string;
  course: Course;
  quiz: Quiz;
  title: string;
  video: string | null;
  text: string | null;
}
