import { User } from './user';
import { Assignment } from './assignment';

export class Reply {
  reply_id: string;
  // assignment: Assignment;
  student: User;
  answers: string[];
  score: number;
  created_at: Date;
}
