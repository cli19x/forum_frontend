import DateTimeFormat = Intl.DateTimeFormat;
import {Timestamp} from 'rxjs';
import {Time} from '@angular/common';

export class Topic {
  pid: number;
  uid: string;
  postTitle: string;
  postData: string;
  nickname: string;
  createTime: string;
  dealDate: string;
  levelCount: string;
}
