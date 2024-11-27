import {Question} from "./question";

export class Answer {
  answer_id: string;
  question: Question;
  text: string | null;
  image: string | null;
  audio: string | null;
  is_correct: boolean;
}