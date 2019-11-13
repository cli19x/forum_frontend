import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../_models/user';
import {AuthService, NotificationService, UserService} from '../_services';
import {Index} from '../_models';
import {PostService} from '../_services/post.service';
import {first} from 'rxjs/operators';
import {Profile} from '../_models/Profile';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Post} from '../_models/post';
import {Router} from '@angular/router';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('statusBox', {static: true}) status: any;
  currentUser: User;
  profileInfo: Profile;
  indexes: Index[] = [];
  displayingPostIndexes: Index[] = [];
  countPost = 0;
  currentPostItemPerPage = 20;
  currentPostPageIndex = 0;
  loading = false;
  submitted = false;
  isEditing = false;
  heightNow = 0;
  visible = 'collapse';
  statusStr = '';
  statusForm: FormGroup;

  comments: Post[] = [];
  displayingCommentIndexes: Post[] = [];
  countComment = 0;
  currentCommentItemPerPage = 20;
  currentCommentPageIndex = 0;

  numberOfPages: number[] = [10, 20, 30, 50];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private postService: PostService,
    private notifService: NotificationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.updateProfile();
    this.getMyPosts();
    this.getMyComments();
    this.statusForm = this.formBuilder.group({
      statusStatement: [this.profileInfo.pSignature]
    });
  }

  getMyPosts() {
    this.postService.getMyPosts(this.currentUser.userId).subscribe(
      indexes => {
        console.log(indexes);
        const {errMsg, msg, userPosts} = indexes;
        if (errMsg) {
          this.notifService.showNotif(`Load my posts error: ${errMsg}`, 'error');
        } else if (msg) {
          console.log(msg);
          console.log(userPosts);
          this.indexes = userPosts;
          console.log(this.indexes);
          this.countPost = this.indexes.length;
          this.onPostDefaultDisplaying();
          this.onCommentDefaultDisplaying();
        }
      },
      error => {
        this.notifService.showNotif(`Load my posts error: ${error}`, 'error');
      });
  }

  getMyComments() {
    this.postService.getMyComments(this.currentUser.userId).subscribe(
      comments => {
        const {errMsg, msg, userPosts} = comments;
        if (errMsg) {
          this.notifService.showNotif(`Load my posts error: ${errMsg}`, 'error');
        } else if (msg) {
          this.comments = userPosts;
          this.countComment = this.comments.length;
          this.onCommentDefaultDisplaying();
        }
      },
      error => {this.notifService.showNotif(`Load my posts error: ${error}`, 'error'); });
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
    if (endIndex <= this.comments.length) {
      this.displayingCommentIndexes = this.comments.slice(startIndex, endIndex);
    } else {
      this.displayingCommentIndexes = this.comments.slice(startIndex);
    }
  }

  onCommentDefaultDisplaying() {
    if (this.currentCommentItemPerPage <= this.comments.length) {
      this.displayingCommentIndexes = this.comments.slice(0, this.currentCommentItemPerPage);
    } else {
      this.displayingCommentIndexes = this.comments.slice(0);
    }
  }


  updateStatus(data1: string) {
    this.submitted = true;
    this.loading = true;
    const update: Post = {
      token: this.currentUser.token,
      postTitle: undefined,
      id: undefined,
      postData: data1,
      commentCount: 0,
      createTime: undefined,
      postId: undefined,
      nickName: undefined,
      motherPostId: undefined,
      level: undefined,
      userId: undefined
    };
    this.userService.updateStatus(update)
      .pipe(first())
      .subscribe(status => {
          console.log('response', status);
          const {msg, errMsg} = status;
          if (errMsg) {
            console.log('Update Status failed');
            this.notifService.showNotif(`Update Status error: ${errMsg}`, 'confirm');
            this.loading = false;
          } else if (msg) {
            console.log(msg);
            this.loading = false;
            this.submitted = false;

          }
        },
        error => {
          this.notifService.showNotif(`Update Status error: ${error}`, 'confirm');
          this.loading = false;
          this.submitted = false;
        }
      );
  }

  updateProfile() {
    this.loading = true;
    this.userService.updateProfile(this.currentUser)
      .pipe(first())
      .subscribe(profile => {
          console.log('response', profile);
          const {msg, errMsg, userInfo} = profile;
          if (errMsg) {
            console.log('Update Status failed');
            this.notifService.showNotif(`Update Profile error: ${errMsg}`, 'confirm');
            this.loading = false;
          } else if (msg) {
            console.log(msg);
            this.loading = false;
            this.profileInfo = userInfo;
            console.log(this.profileInfo);
            this.submitted = false;
            this.statusStr = this.profileInfo.pSignature;
          }
        },
        error => {
          this.notifService.showNotif(`Update Profile error: ${error}`, 'confirm');
          this.loading = false;
          this.submitted = false;
        }
      );
  }

  onEdit() {
    this.isEditing = !this.isEditing;
    this.heightNow = 80;
    this.visible = 'visible';
  }


  async onSave(statusS: string) {
    this.updateStatus(statusS);

    this.heightNow = 0;
    this.visible = 'hidden';
    await this.delay(300);
    this.updateProfile();
    this.isEditing = !this.isEditing;
  }
  private delay(ms: number) {

    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  gotoTopic(id: number) {
    this.router.navigate(['/topic', {id}]).then(res => {
      console.log(res);
    });
  }
}
