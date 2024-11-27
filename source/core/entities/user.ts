import { Course } from './course';
import { CourseProgress } from './courseProgress';

export class User {
  user_id: string;
  username: string;
  role: 'user' | 'teacher' | 'admin' | 'moderator';
  password: string;
  fullName : string;
  sex : "male" | "female";
  age: number;
  nation: string;
  mail: string;
  phone: string;
  courses: Course[];
  courseProgress: CourseProgress[];
}
