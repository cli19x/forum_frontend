import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService, NotificationService, UserService} from '../_services';
import {EventService} from '../_services/event.service';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TopicDetail} from '../_models/topicDetail';
import {Router} from '@angular/router';
import {UserInfo} from '../_models/userInfo';
import {CommentDetail} from '../_models/commentDetail';
import {ResponseObject} from '../_models/responseObject';
import {UpdateSignature} from '../_models/updateSignature';
import {UserImage} from '../_models/userImage';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('statusBox', {static: true}) status: any;
  currentUser: UserInfo;
  profileInfo: UserInfo;
  topicIndexes: TopicDetail[] = [];
  displayingTopicIndexes: TopicDetail[] = [];
  countPost = 0;
  currentPostItemPerPage = 20;
  currentPostPageIndex = 0;
  loading = true;
  submitted = false;
  isEditing = false;
  heightNow = 0;
  visible = 'collapse';
  statusStr = '';
  statusForm: FormGroup;

  commentIndexes: CommentDetail[] = [];
  displayingCommentIndexes: CommentDetail[] = [];
  countComment = 0;
  currentCommentItemPerPage = 20;
  currentCommentPageIndex = 0;


  replyIndexes: TopicDetail[] = [];
  displayingReplyIndexes: TopicDetail[] = [];
  countReplies = 0;
  currentRepliesItemPerPage = 20;
  currentRepliesPageIndex = 0;

  numberOfPages: number[] = [10, 20, 30, 50];
  avatar: any;
  background: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private postService: EventService,
    private notifyService: NotificationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.updateProfile();
    this.getMyTopics();
    this.getMyComments();
    this.getMyReplies();
  }

  getMyTopics() {
    this.postService.getMyTopics(this.currentUser.uid).subscribe(
      myTopics => {
        const responseObject: ResponseObject = myTopics;
        if (responseObject.errMsg) {
          this.notifyService.showNotif(`Load my posts error: ${responseObject.errMsg}`, 'error');
          this.router.navigate(['/login']).then(res => {
            console.log(res);
          });
        } else if (responseObject.msg) {
          this.topicIndexes = responseObject.objects as TopicDetail[];
          this.countPost = this.topicIndexes.length;
          this.onPostDefaultDisplaying();
        }
      },
      error => {
        this.notifyService.showNotif(`Load my posts error: ${error}`, 'error');
      });
  }

  getMyComments() {
    this.postService.getMyComments(this.currentUser.uid).subscribe(
      // tslint:disable-next-line:variable-name
      myComments => {
        const responseObject: ResponseObject = myComments;
        if (responseObject.errMsg) {
          this.notifyService.showNotif(`Load my posts error: ${responseObject.errMsg}`, 'error');
          this.router.navigate(['/login']).then(res => {
            console.log(res);
          });
        } else if (responseObject.msg) {
          this.commentIndexes = responseObject.objects as CommentDetail[];
          this.countComment = this.commentIndexes.length;
          this.onCommentDefaultDisplaying();
        }
      },
      error => {
        this.notifyService.showNotif(`Load my posts error: ${error}`, 'error');
      });
  }


  getMyReplies() {
    this.postService.getMyReplies(this.currentUser.uid).subscribe(
      // tslint:disable-next-line:variable-name
      myReplies => {
        const responseObject: ResponseObject = myReplies;
        if (responseObject.errMsg) {
          this.notifyService.showNotif(`Load my posts error: ${responseObject.errMsg}`, 'error');
          this.router.navigate(['/login']).then(res => {
            console.log(res);
          });
        } else if (responseObject.msg) {
          this.replyIndexes = responseObject.objects as TopicDetail[];
          this.countReplies = this.replyIndexes.length;
          this.onRepliesDefaultDisplaying();
        }
      },
      error => {
        this.notifyService.showNotif(`Load my posts error: ${error}`, 'error');
      });
  }


  onPostPaginateChanging($event) {
    this.currentPostItemPerPage = $event.pageSize;
    this.currentPostPageIndex = $event.pageIndex;
    const startIndex = this.currentPostPageIndex * this.currentPostItemPerPage;
    const endIndex = (this.currentPostItemPerPage) * this.currentPostPageIndex + this.currentPostItemPerPage;
    if (endIndex <= this.topicIndexes.length) {
      this.displayingTopicIndexes = this.topicIndexes.slice(startIndex, endIndex);
    } else {
      this.displayingTopicIndexes = this.topicIndexes.slice(startIndex);
    }
  }

  onPostDefaultDisplaying() {
    if (this.currentPostItemPerPage <= this.topicIndexes.length) {
      this.displayingTopicIndexes = this.topicIndexes.slice(0, this.currentPostItemPerPage);
    } else {
      this.displayingTopicIndexes = this.topicIndexes.slice(0);
    }
  }

  onRepliesPaginateChanging($event) {
    this.currentRepliesItemPerPage = $event.pageSize;
    this.currentRepliesPageIndex = $event.pageIndex;
    const startIndex = this.currentRepliesPageIndex * this.currentRepliesItemPerPage;
    const endIndex = (this.currentRepliesItemPerPage) * this.currentRepliesPageIndex + this.currentRepliesItemPerPage;
    if (endIndex <= this.replyIndexes.length) {
      this.displayingReplyIndexes = this.replyIndexes.slice(startIndex, endIndex);
    } else {
      this.displayingReplyIndexes = this.replyIndexes.slice(startIndex);
    }
  }

  onRepliesDefaultDisplaying() {
    if (this.currentRepliesItemPerPage <= this.replyIndexes.length) {
      this.displayingReplyIndexes = this.replyIndexes.slice(0, this.currentRepliesItemPerPage);
    } else {
      this.displayingReplyIndexes = this.replyIndexes.slice(0);
    }
  }


  onCommentPaginateChanging($event) {
    this.currentCommentItemPerPage = $event.pageSize;
    this.currentCommentPageIndex = $event.pageIndex;
    const startIndex = this.currentCommentPageIndex * this.currentCommentItemPerPage;
    const endIndex = (this.currentCommentItemPerPage) * this.currentCommentPageIndex + this.currentCommentItemPerPage;
    if (endIndex <= this.commentIndexes.length) {
      this.displayingCommentIndexes = this.commentIndexes.slice(startIndex, endIndex);
    } else {
      this.displayingCommentIndexes = this.commentIndexes.slice(startIndex);
    }
  }

  onCommentDefaultDisplaying() {
    if (this.currentCommentItemPerPage <= this.commentIndexes.length) {
      this.displayingCommentIndexes = this.commentIndexes.slice(0, this.currentCommentItemPerPage);
    } else {
      this.displayingCommentIndexes = this.commentIndexes.slice(0);
    }
  }


  updateSignature(data1: string) {
    this.submitted = true;
    const signature: UpdateSignature = {
      uid: this.currentUser.uid,
      email: this.currentUser.email,
      pSignature: data1
    };
    this.userService.updateSignature(signature)
      .pipe(first())
      .subscribe(status => {
          const responseObject: ResponseObject = status;
          if (responseObject.errMsg) {
            this.submitted = false;
            this.notifyService.showNotif(`Update Status error: ${responseObject.errMsg}`, 'error');
          } else if (responseObject.msg) {
            this.submitted = false;
            this.updateProfile();
            this.notifyService.showNotif(responseObject.msg, 'confirm');
          }
        },
        error => {
          this.notifyService.showNotif(`Update Status error: ${error}`, 'error');
          this.submitted = false;
        }
      );
  }

  updateProfile() {
    this.userService.getUserProfile(this.currentUser.uid)
      .pipe(first())
      .subscribe(profile => {
          const responseObject: ResponseObject = profile;
          if (responseObject.errMsg) {
            this.notifyService.showNotif(`Update Profile error: ${responseObject.errMsg}`, 'error');
          } else if (responseObject.msg) {
            this.profileInfo = responseObject.objects as UserInfo;
            this.submitted = false;
            this.statusStr = this.profileInfo.signature;
          }
        },
        error => {
          this.notifyService.showNotif(`Update Profile error: ${error}`, 'error');
          this.submitted = false;
        }, () => {
          this.statusForm = this.formBuilder.group({
            statusStatement: [this.profileInfo.signature]
          });
          const imageData = JSON.parse(localStorage.getItem('image'));
          imageData ? this.avatar = imageData.avatar :
            this.avatar = 'https://group-raiser-angular.s3.amazonaws.com/assets/test.jpg';
          imageData ? this.background = imageData.background :
            this.background = 'https://group-raiser-angular.s3.amazonaws.com/assets/new_bg.jpg';
          localStorage.removeItem('currentUser');
          localStorage.setItem('currentUser', JSON.stringify(this.profileInfo));
        }
      );
  }

  chooseAvatarFile() {
    document.getElementById('upload-avatar').click();
  }

  addAvatar(fileInput: any) {
    const fileRead = fileInput.target.files[0];
    const formData = new FormData();
    formData.append('file', fileRead);
    this.userService.uploadUserAvatar(this.currentUser.uid, formData)
      .pipe(first())
      .subscribe(data => {
          const responseObject: ResponseObject = data;
          if (responseObject.errMsg) {
            this.notifyService.showNotif(`Update Avatar error: ${responseObject.errMsg}`, 'error');
          } else if (responseObject.msg) {
            this.notifyService.showNotif(`${responseObject.msg}`, 'error');
            this.submitted = false;
          }
        },
        error => {
          this.notifyService.showNotif(`Update Avatar error: ${error}`, 'error');
          this.submitted = false;
        }, () => {
          this.getAvatar();
        }
      );
  }

  chooseBackgroundFile() {
    document.getElementById('upload-background').click();
  }

  addBackground(fileInput: any) {
    const fileRead = fileInput.target.files[0];
    const formData = new FormData();
    formData.append('file', fileRead);
    this.userService.uploadUserBackground(this.currentUser.uid, formData)
      .pipe(first())
      .subscribe(data => {
          const responseObject: ResponseObject = data;
          if (responseObject.errMsg) {
            this.notifyService.showNotif(`Update Avatar error: ${responseObject.errMsg}`, 'error');
          } else if (responseObject.msg) {
            this.notifyService.showNotif(`${responseObject.msg}`, 'error');
            this.submitted = false;
          }
        },
        error => {
          this.notifyService.showNotif(`Update Avatar error: ${error}`, 'error');
          this.submitted = false;
        }, () => {
          this.getBackground();
        }
      );
  }

  getAvatar() {
    this.userService.downloadUserAvatar(this.currentUser.uid)
      .pipe(first())
      .subscribe(data => {
          const responseObject: ResponseObject = data;
          if (responseObject.errMsg) {
            this.notifyService.showNotif(`Update Avatar error: ${responseObject.errMsg}`, 'error');
          } else if (responseObject.msg) {
            this.notifyService.showNotif(`${responseObject.msg}`, 'confirm');
            this.submitted = false;
            const objectURL = 'data:image/jpeg;base64,' + responseObject.objects;
            this.avatar = objectURL;

            let bgData;
            if (localStorage.getItem('image')) {
              bgData = JSON.parse(localStorage.getItem('image')).background;
              localStorage.removeItem('image');
            }
            const img: UserImage = {
              avatar: objectURL,
              background: bgData
            };
            localStorage.setItem('image', JSON.stringify(img));
          }
        }, error => {
          this.notifyService.showNotif(`Update Avatar error: ${error}`, 'error');
          this.submitted = false;
        }
      );
  }

  getBackground() {
    this.userService.downloadUserBackground(this.currentUser.uid)
      .pipe(first())
      .subscribe(data => {
          const responseObject: ResponseObject = data;
          if (responseObject.errMsg) {
            this.notifyService.showNotif(`Update Background error: ${responseObject.errMsg}`, 'error');
          } else if (responseObject.msg) {
            this.notifyService.showNotif(`${responseObject.msg}`, 'confirm');
            this.submitted = false;
            const objectURL = 'data:image/jpeg;base64,' + responseObject.objects;
            this.background = objectURL;

            let avData;
            if (localStorage.getItem('image')) {
              avData = JSON.parse(localStorage.getItem('image')).avatar;
              localStorage.removeItem('image');
            }
            const img: UserImage = {
              avatar: avData,
              background: objectURL
            };
            localStorage.setItem('image', JSON.stringify(img));
          }
        }, error => {
          this.notifyService.showNotif(`Update Background error: ${error}`, 'error');
          this.submitted = false;
        }, () => {
          this.loading = false;
        }
      );
  }


  onEdit() {
    this.isEditing = !this.isEditing;
    this.heightNow = 80;
    this.visible = 'visible';
  }


  async onSave(statusS: string) {
    this.updateSignature(statusS);
    this.heightNow = 0;
    this.visible = 'hidden';
    await this.delay(300);
    this.updateProfile();
    this.isEditing = !this.isEditing;
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  gotoTopic(mid: number) {
    this.router.navigate(['/topic', {mid}]).then(res => {
      console.log(res);
    });
  }

  gotoUser(uid: string) {
    this.router.navigate(['/other-profile', {uid}]).then(res => {
      console.log(res);
    });
  }
}
