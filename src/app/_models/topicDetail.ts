import {CommentDetail} from './commentDetail';



export class TopicDetail {
  pid: number;
  uid: string;
  mid: number;
  createTime: string;
  nickname: string;
  postTitle: string;
  postData: string;
  commentCount: number;
  dealDate: string;
  week: number;
  levelCount: number;
  commentDetailList: Array<CommentDetail>;
}
