import { Answer } from './answer';
import {Quiz, Test} from "../../frameworks/data-service/postgre/model";
import {Assignment} from "./assignment";
import {QuestionVersion} from "./questionVersion";
import {StartTest} from "./startTest";

export class Question {
  question_id: string;
  // assignment: Assignment;
  start_test : StartTest
  test: Test | null;
  quiz: Quiz | null;
  text: string;
  image: string | null;
  audio: string | null;
  video: string | null;
  answers: Answer[];
  is_submitted: boolean;
  versions : QuestionVersion[]
}
