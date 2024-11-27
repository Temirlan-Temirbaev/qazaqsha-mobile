import {Question} from "./question";

export class QuestionVersion {
  version_id: string;
  question: Question;
  text: string;
  image: string | null;
  audio: string | null;
  video: string | null;
  is_submitted: boolean;
  created_at: Date;
}