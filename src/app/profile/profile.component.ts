import { Component, OnInit } from '@angular/core';
import {User} from '../_models/user';
import {AuthService, NotificationService, UserService} from '../_services';
import {Router} from '@angular/router';
import {Index} from '../_models';
import {PostService} from '../_services/post.service';
import {MyComment} from '../_models/myComment';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User;
  indexes: Index[] = [];
  displayingPostIndexes: Index[] = [];
  countPost = 0;
  currentPostItemPerPage = 20;
  currentPostPageIndex = 0;


  comments: MyComment[] = [];
  displayingCommentIndexes: Index[] = [];
  countComment = 0;
  currentCommentItemPerPage = 20;
  currentCommentPageIndex = 0;

  numberOfPages: number[] = [10, 20, 30, 50];
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private postService: PostService,
    private notifService: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getMyPosts();
    this.getMyComments();
  }

  getMyPosts() {
    this.postService.getIndexes().subscribe(
      indexes => {
        console.log(indexes);
        const {errMsg, msg, objects} = indexes;
        if (errMsg) {
          this.notifService.showNotif(`Load my posts error: ${errMsg}`, 'error');
        } else if (msg) {
          console.log(msg);
          console.log(objects);
          this.indexes = objects;
          console.log(this.indexes);
          this.countPost = this.indexes.length;
          this.onPostDefaultDisplaying();
        }
      },
      error => {this.notifService.showNotif(`Load my posts error: ${error}`, 'error'); });
  }

  getMyComments() {
    // this.postService.getIndexes().subscribe(
    //   comments => {
    //     const {errMsg, msg, objects} = comments;
    //     if (errMsg) {
    //       this.notifService.showNotif(`Load my posts error: ${errMsg}`, 'error');
    //     } else if (msg) {
    //       this.comments = objects;
    //       this.count = this.comments.length;
    //       this.onDefaultDisplaying();
    //     }
    //   },
    //   error => {this.notifService.showNotif(`Load my posts error: ${error}`, 'error'); });
    this.comments[0] = {postTitle: 'test1', comment: 'ha ha ha ha ha1', nickName: this.currentUser.nickName, time: new Date()};
    this.comments[1] = {postTitle: 'test2', comment: 'ha ha ha ha ha2', nickName: this.currentUser.nickName, time: new Date()};
    this.comments[2] = {postTitle: 'test3', comment: 'ha ha ha ha ha3', nickName: this.currentUser.nickName, time: new Date()};
    this.comments[3] = {postTitle: 'test4', comment: 'ha ha ha ha ha4', nickName: this.currentUser.nickName, time: new Date()};
  }

  onPostPaginateChanging($event) {
    this.currentPostItemPerPage = $event.pageSize;
    this.currentPostPageIndex = $event.pageIndex;
    const startIndex = this.currentPostPageIndex * this.currentPostItemPerPage;
    const endIndex = (this.currentPostItemPerPage) * this.currentPostPageIndex + this.currentPostItemPerPage;
    if (endIndex <= this.indexes.length) {
      this.displayingPostIndexes = this.indexes.slice(startIndex, endIndex);
    } else {
      this.displayingPostIndexes = this.indexes.slice(startIndex);
    }
  }

  onPostDefaultDisplaying() {
    if (this.currentPostItemPerPage <= this.indexes.length) {
      this.displayingPostIndexes = this.indexes.slice(0, this.currentPostItemPerPage);
    } else {
      this.displayingPostIndexes = this.indexes.slice(0);
    }
  }

  onCommentPaginateChanging($event) {
    this.currentCommentItemPerPage = $event.pageSize;
    this.currentCommentPageIndex = $event.pageIndex;
    const startIndex = this.currentCommentPageIndex * this.currentCommentItemPerPage;
    const endIndex = (this.currentCommentItemPerPage) * this.currentCommentPageIndex + this.currentCommentItemPerPage;
    if (endIndex <= this.indexes.length) {
      this.displayingCommentIndexes = this.indexes.slice(startIndex, endIndex);
    } else {
      this.displayingCommentIndexes = this.indexes.slice(startIndex);
    }
  }

  onCommentDefaultDisplaying() {
    if (this.currentCommentItemPerPage <= this.indexes.length) {
      this.displayingCommentIndexes = this.indexes.slice(0, this.currentCommentItemPerPage);
    } else {
      this.displayingCommentIndexes = this.indexes.slice(0);
    }
  }
}
