import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PostService} from '../_services/post.service';
import {AuthService, NotificationService} from '../_services';
import {Post} from '../_models/post';
import {User} from '../_models/user';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent implements OnInit {
  displayingTopics: Post[] = [];
  topics: Post[] = [];
  submitted = false;
  loading = false;
  currentUser: User;
  isInvalid = false;
  errorMessage = '';
  postId: number;
  topicTitle: string;
  count: number;
  private router: Router;
  currentItemPerPage = 20;
  currentPageIndex = 0;
  numberOfPages: number[] = [10, 20, 30, 50];
  constructor(private route: ActivatedRoute,
              private postService: PostService,
              private notifService: NotificationService,
              private authService: AuthService) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.postId = params.motherId;
      this.topicTitle = params.postTitle;
      console.log(this.postId);
    });
    this.getDetails();
  }

  getDetails() {
    this.postService.getTopics(this.postId).subscribe(
      indexes => {
        console.log(indexes);
        const {errMsg, msg, userPosts} = indexes;
        if (errMsg) {
          this.notifService.showNotif(`Load topics error: ${errMsg}`, 'error');
        } else if (msg) {
          console.log(msg);
          console.log(userPosts);
          this.topics = userPosts;
          console.log(this.topics);
          this.count = this.topics.length;
          this.onDefaultDisplaying();
        }
      },
      error => {
        this.notifService.showNotif(`Load topics error: ${error}`, 'error');
      });
  }

  onPaginateChange($event) {
    this.currentItemPerPage = $event.pageSize;
    this.currentPageIndex = $event.pageIndex;
    const startIndex = this.currentPageIndex * this.currentItemPerPage;
    const endIndex = (this.currentItemPerPage) * this.currentPageIndex + this.currentItemPerPage;
    if (endIndex <= this.topics.length) {
      this.displayingTopics = this.topics.slice(startIndex, endIndex);
    } else {
      this.displayingTopics = this.topics.slice(startIndex);
    }
  }

  onDefaultDisplaying() {
    if (this.currentItemPerPage <= this.topics.length) {
      this.displayingTopics = this.topics.slice(0, this.currentItemPerPage);
    } else {
      this.displayingTopics = this.topics.slice(0);
    }
  }
  deleteTopic($event) {

  }

  onSubmit(comment: string) {
    console.log(this.currentUser.userId);
    this.isInvalid = false;
    this.submitted = true;
    if (!comment.replace(/\s/g, '').length) {
      this.errorMessage = 'Invalid input in Main Content';
      this.isInvalid = true;
      return;
    }
    this.loading = true;
    const post: Post = {
      token: this.currentUser.token,
      postTitle: undefined,
      postData: comment,
      id: undefined,
      createTime: undefined,
      postId: this.postId,
      level: undefined,
      nickName: undefined,
      motherPostId: undefined,
      userId: this.currentUser.userId
    };
    this.count++;
    console.log(post);
    this.postService.submitPost(post)
      .pipe(first())
      .subscribe(newPost => {
          console.log('response', newPost);
          const {msg, errMsg} = newPost;
          if (errMsg) {
            console.log('Post failed');
            this.notifService.showNotif(`Post error: ${errMsg}`, 'confirm');
            this.loading = false;
          } else if (msg) {
            console.log(msg);
            this.getDetails();
            this.notifService.showNotif('Post success', 'confirm');
            this.loading = false;
            location.reload();
          }
        },
        error => {
          this.notifService.showNotif(`Post error: ${error}`, 'error');
          this.loading = false;
        }
      );
  }

}
