import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from '../_models/post';
import {Index} from '../_models';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient) { }

  submitPost(post: Post) {
    return this.http.post<any>(`http://end.greatbestus.com/postTopic`, post);
  }

  getIndexes() {
    return this.http.get<any>('http://end.greatbestus.com/getIndexContent');
  }

}
