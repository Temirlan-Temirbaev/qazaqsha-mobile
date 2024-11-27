import { Reply } from './reply';

export abstract class Assignment {
  assignment_id: string;
  title: string;
  replies: Reply[];
  points: number;
}
