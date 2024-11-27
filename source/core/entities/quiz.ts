import { Lesson } from './lesson';
import { Assignment } from './assignment';
import {Question} from "./question";

export class Quiz extends Assignment {
  lesson: Lesson;
  questions: Question[];
}
