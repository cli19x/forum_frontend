import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from '../_models/post';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient) { }

  submitPost(post: Post) {
    return this.http.post<any>(`http://end.greatbestus.com:8080/postTopic`, post);
  }

  getIndexes() {
    return this.http.get<any>('http://end.greatbestus.com:8080/getIndexContent');
  }

  getTopics(postId: number) {
    return this.http.post<any>('http://end.greatbestus.com:8080/getPostsById', {postId});
  }

  getMyPosts(userId: number) {
    return this.http.post<any>('http://end.greatbestus.com:8080/getUserPosts', userId);
  }

  getMyComments(userId: number) {
    return this.http.post<any>('http://end.greatbestus.com:8080/getUserComments', userId);
  }

  deletePost(postId: number) {
    return this.http.post<any>('http://end.greatbestus.com:8080/deletePostById', {postId});
  }
}
