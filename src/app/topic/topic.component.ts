import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TopicDetail} from '../_models/topicDetail';
import {AuthService, NotificationService, UserService} from '../_services';
import {ActivatedRoute, Router} from '@angular/router';
import {UserInfo} from '../_models/userInfo';
import {CommentDetail} from '../_models/commentDetail';
import {first} from 'rxjs/operators';
import {EventService} from '../_services/event.service';
import {MatDialog} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {ResponseObject} from '../_models/responseObject';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'topic-component',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit {
  @Input() topic: TopicDetail;
  // tslint:disable-next-line:variable-name
  comment_list: CommentDetail[] = [];
  @Output() deleteEvent = new EventEmitter<any>();
  @Input() isDelSuccess = false;
  @Output() delCommentEvent = new EventEmitter<any>();
  currentUser: UserInfo;
  commentText = '';
  @ViewChild('postContent', {static: true}) post: any;
  isHidden = true;
  visible = 'collapse';
  heightNow = '0';
  isPosting = false;
  errorMessage = '';
  comment: CommentDetail;
  userAvatar: any;
  content: any;
  dealDateString: string;

  constructor(private authService: AuthService,
              private router: Router,
              private postService: EventService,
              private userService: UserService,
              private notifyService: NotificationService,
              private route: ActivatedRoute,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.isHidden = true;
    this.dealDateString = new Date(this.topic.dealDate)
      .toLocaleString('en-US',
        {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute : '2-digit'});
    this.comment_list = this.topic.commentDetailList;
    if (this.comment_list == null) {
      this.comment_list = [];
    }
    this.getUserAvatar();
  }

  toggle() {
    this.isHidden = !this.isHidden;
    if (this.isHidden) {
      this.visible = 'collapse';
      this.heightNow = '0';
    }
    if (!this.isHidden) {
      this.visible = 'visible';
      this.heightNow = 'auto';
    }
  }

  getUserAvatar() {
    this.userService.downloadUserAvatar(this.topic.uid)
      .pipe(first())
      .subscribe(data => {
        console.log(data);
        const responseObject: ResponseObject = data;
        if (responseObject.errMsg) {
          this.userAvatar = 'https://group-raiser-angular.s3.amazonaws.com/assets/test.jpg';
          return;
        } else if (responseObject.msg) {
          if (responseObject.objects) {
            this.userAvatar = 'data:image/jpeg;base64,' + responseObject.objects;
          } else {
            this.userAvatar = 'https://group-raiser-angular.s3.amazonaws.com/assets/test.jpg';
          }
        }
      }, error => {
        console.log('error');
      });
  }


  onPost() {
    this.isPosting = true;
    if (!this.commentText.replace(/\s/g, '').length) {
      this.errorMessage = 'CommentDetail cannot be empty';
      this.isPosting = false;
      return;
    }
    if (this.currentUser.uid === this.topic.uid) {
      this.comment = {
        cid: undefined,
        uid: this.currentUser.uid,
        targetUid: this.currentUser.uid,
        pid: this.topic.pid,
        mid: this.topic.mid,
        commentTime: undefined,
        nickname: this.currentUser.nickname,
        targetNickname: '',
        comment: this.commentText,
        postTitle: this.topic.postTitle
      };
    } else {
      this.comment = {
        cid: undefined,
        uid: this.currentUser.uid,
        targetUid: this.topic.uid,
        pid: this.topic.pid,
        mid: this.topic.mid,
        commentTime: undefined,
        nickname: this.currentUser.nickname,
        targetNickname: this.topic.nickname,
        comment: this.commentText,
        postTitle: this.topic.postTitle
      };
    }
    console.log(this.comment);
    this.postService.postComment(this.comment)
      .pipe(first())
      .subscribe(newPost => {
          console.log('response', newPost);
          const responseObject: ResponseObject = newPost;
          if (responseObject.errMsg) {
            this.notifyService.showNotif(`Post error: ${responseObject.errMsg}`, 'error');
            this.isPosting = false;
            this.logout();
          } else if (responseObject.msg) {
            this.notifyService.showNotif(responseObject.msg, 'confirm');
            this.isPosting = false;
            this.comment_list.push(responseObject.objects as CommentDetail);
            this.topic.commentCount ++;
            this.commentText = '';
          }
        },
        error => {
          this.notifyService.showNotif(`Post error: ${error}`, 'error');
          this.isPosting = false;
        }
      );
  }

  deletePost(pid: number, mid: number) {
    this.deleteEvent.emit({PID: pid, MID: mid});
  }

  isSelf() {
    return this.currentUser.uid === this.topic.uid;
  }

  seeOthers() {
    if (this.currentUser.uid === this.topic.uid) {
      this.router.navigate(['/profile', {uid: this.topic.uid}]).then(res => {
        console.log(res);
      });
    } else {
      this.router.navigate(['/other-profile', {uid: this.topic.uid}]).then(res => {
        console.log(res);
      });
    }
  }



  onDeleteComment(ids: any) {
    const {CID, PID} = ids;
    this.openDialog(CID, PID);
  }

  openDialog(cid: number, pid: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Confirm',
          cancel: 'Cancel'
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteComment(cid, pid);
      }
    });
  }

  deleteComment(CID: number, PID: number) {
    this.postService.deleteComment(CID, this.currentUser.uid, PID).subscribe(
      del => {
        const responseObject: ResponseObject = del;
        if (responseObject.errMsg) {
          this.notifyService.showNotif(`Delete error: ${responseObject.errMsg}`, 'error');
          this.logout();
        } else if (responseObject.msg) {
          this.comment_list = this.comment_list.filter(e => e.cid !== CID);
          this.topic.commentCount --;
          this.notifyService.showNotif(responseObject.msg, 'confirm');
        }
      },
      error => {
        this.notifyService.showNotif(`Delete error: ${error}`, 'error');
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(res => {
      console.log(res);
    });
  }
}
