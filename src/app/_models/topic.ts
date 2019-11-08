import {User} from './user';
import {Data} from '@angular/router';

export class Topic {
  replies: number;
  postTitle: string;
  id: string;
  mainPost: string;
  postedBy?: User;
  date: Data;
}
