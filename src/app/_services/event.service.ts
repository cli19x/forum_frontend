import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TopicDetail} from '../_models/topicDetail';
import {CommentDetail} from '../_models/commentDetail';
import {Time} from '@angular/common';

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) {
  }

  getTopics() {
    return this.http.get<any>(`http://localhost:8080/user/api/topic/index?`);
  }

  postTopicOrPost(topicDetail: TopicDetail) {
    return this.http.post<any>(`http://localhost:8080/user/api/topic/submit`, topicDetail);
  }

  // pid & uid
  deleteTopicOrPost(pid: number, uid: string, mid: number) {
    return this.http.delete<any>(`http://localhost:8080/user/api/topic/delete?` +
      `pid=${pid.toString()}&uid=${uid}&mid=${mid.toString()}`);
  }

  getTopicDetail(pid: number) {
    return this.http.get<any>(`http://localhost:8080/user/api/topic-detail/${pid}`);
  }

  getMyTopics(uid: string) {
    return this.http.get<any>(`http://localhost:8080/user/api/my-topic/${uid}`);
  }

  getMyReplies(uid: string) {
    return this.http.get<any>(`http://localhost:8080/user/api/my-reply/${uid}`);
  }

  postComment(commentDetail: CommentDetail) {
    return this.http.post<any>(`http://localhost:8080/user/api/comment/submit`, commentDetail);
  }

  deleteComment(cid: number, uid: string, pid: number) {
    return this.http.delete<any>(`http://localhost:8080/user/api/comment/delete?cid=${cid.toString()}&uid=${uid}&pid=${pid.toString()}`);
  }

  getMyComments(uid: string) {
    return this.http.get<any>(`http://localhost:8080/user/api/comment/${uid}`);
  }
}
