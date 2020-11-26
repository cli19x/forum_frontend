import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from '../_services/event.service';
import {AuthService, NotificationService} from '../_services';
import {TopicDetail} from '../_models/topicDetail';
import {first} from 'rxjs/operators';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material';
import {UserInfo} from '../_models/userInfo';
import {TopicComponent} from '../topic/topic.component';
import {ResponseObject} from '../_models/responseObject';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css'],
})
export class DetailPageComponent implements OnInit {
  @ViewChild(TopicComponent, {static: true}) childTopic: TopicComponent;
  subPost = '';
  displayingTopics: TopicDetail[] = [];
  topics: TopicDetail[] = [];
  submitted = false;
  loading = false;
  currentUser: UserInfo;
  isInvalid = false;
  errorMessage = '';
  postId: number;
  count: number;
  currentItemPerPage = 20;
  currentPageIndex = 0;
  numberOfPages: number[] = [10, 20, 30, 50];
  loaded = false;
  constructor(private route: ActivatedRoute,
              private postService: EventService,
              private notifyService: NotificationService,
              private authService: AuthService,
              private dialog: MatDialog,
              private router: Router) {

  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.route.params.subscribe(params => {
      this.postId = params.mid;
    });
    this.getDetails();
  }

  getDetails() {
    this.postService.getTopicDetail(this.postId).subscribe(
      detail => {
        const responseObject: ResponseObject = detail;
        if (responseObject.errMsg) {
          this.notifyService.showNotif(`Load topic detail error: ${responseObject.errMsg}`, 'error');
          this.logout();
        } else if (responseObject.msg) {
          this.topics = responseObject.objects as TopicDetail[];
          this.count = this.topics.length;
          this.notifyService.showNotif(responseObject.msg, 'confirm');
          this.onDefaultDisplaying();
          this.loaded = true;
        }
      },
      error => {
        this.notifyService.showNotif(`Load topics error: ${error}`, 'error');
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

  onSubmit(reply: string) {
    this.isInvalid = false;
    this.submitted = true;
    if (!reply.replace(/\s/g, '').length) {
      this.errorMessage = 'Invalid input in Reply Content';
      this.isInvalid = true;
      return;
    }
    this.loading = true;
    const post: TopicDetail = {
      postTitle: this.topics[0].postTitle,
      postData: reply,
      pid: undefined,
      uid: this.currentUser.uid,
      mid: this.postId,
      createTime: undefined,
      commentCount: undefined,
      nickname: this.currentUser.nickname,
      dealDate: this.topics[0].dealDate,
      week: this.topics[0].week,
      levelCount: undefined,
      commentDetailList: undefined
    };
    this.count++;
    this.postService.postTopicOrPost(post)
      .pipe(first())
      .subscribe(newLevel => {
          const responseObject: ResponseObject = newLevel;
          if (responseObject.errMsg) {
            this.notifyService.showNotif(`Post error: ${responseObject.errMsg}`, 'error');
            this.loading = false;
            this.logout();
          } else if (responseObject.msg) {
            this.getDetails();
            this.notifyService.showNotif(responseObject.msg, 'confirm');
            this.loading = false;
            this.getDetails();
            this.subPost = '';
            window.scrollTo(0, 0);
          }
        },
        error => {
          this.notifyService.showNotif(`Post error: ${error}`, 'error');
          this.loading = false;
        }
      );
  }

  deleteThis(info: any) {
    const {PID, MID} = info;
    this.openDialog(PID, MID);
  }


  openDialog(pid: number, mid: number) {
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
        this.deletePost(pid, mid);
      }
    });
  }

  deletePost(pid: number, mid: number) {
    this.postService.deleteTopicOrPost(pid, this.currentUser.uid, mid).subscribe(
      del => {
        const responseObject: ResponseObject = del;
        if (responseObject.errMsg) {
          this.notifyService.showNotif(`Delete error: ${responseObject.errMsg}`, 'error');
        } else if (responseObject.msg) {
          if (mid === -1) {
            this.router.navigate(['/']).then(res => {
              console.log(res);
            });
          } else {
            this.topics = this.topics.filter(e => e.pid !== pid);

            this.onDefaultDisplaying();
            this.notifyService.showNotif(responseObject.msg, 'confirm');
          }
        }
      },
      error => {
        this.notifyService.showNotif(`Delete error: ${error}`, 'error');
      });
  }

  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    if (pastedText.length > 800) {
      this.subPost = pastedText.slice(0, 800);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(res => {
      console.log(res);
    });
  }

}
