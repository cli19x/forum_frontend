import {Component, OnInit} from '@angular/core';
import {EventService} from '../_services/event.service';
import {AuthService, NotificationService, UserService} from '../_services';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {UserInfo} from '../_models/userInfo';
import {TopicDetail} from '../_models/topicDetail';
import {ResponseObject} from '../_models/responseObject';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.css']
})
export class OtherProfileComponent implements OnInit {
  otherProfile: UserInfo;
  indexes: TopicDetail[] = [];
  currentUser: UserInfo;
  displayingPostIndexes: TopicDetail[] = [];
  countPost = 0;
  currentPostItemPerPage = 20;
  currentPostPageIndex = 0;
  loading = true;
  submitted = false;

  otherUID: string;
  numberOfPages: number[] = [10, 20, 30, 50];

  otherAvatar: any;
  otherBackground: any;
  constructor(private postService: EventService,
              private notifyService: NotificationService,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private authService: AuthService) {
  }


  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.route.params.subscribe(params => {
      this.otherUID = params.uid;
    });
    this.getProfile();
  }

  getProfile() {
    this.userService.getUserProfile(this.otherUID)
      .pipe(first())
      .subscribe(profile => {
          console.log('response', profile);
          const responseObject: ResponseObject = profile;
          if (responseObject.errMsg) {
            this.notifyService.showNotif(`Update Profile error: ${responseObject.errMsg}`, 'error');
            this.logout();
          } else if (responseObject.msg) {
            this.loading = false;
            this.otherProfile = responseObject.objects as UserInfo;
            this.getOtherPost();
            this.getOtherAvatar();
            this.getOtherBackground();
            this.notifyService.showNotif( responseObject.msg, 'confirm');
          }
        },
        error => {
          this.notifyService.showNotif(`Update Profile error: ${error}`, 'error');
          this.loading = false;
          this.submitted = false;
        }
      );
  }

  getOtherPost() {
    this.postService.getMyTopics(this.otherUID).subscribe(
      indexes => {
        const responseObject: ResponseObject = indexes;
        if (responseObject.errMsg) {
          this.notifyService.showNotif(`Load my posts error: ${responseObject.errMsg}`, 'error');
          this.logout();
        } else if (responseObject.msg) {
          console.log(responseObject.msg);
          this.indexes = responseObject.objects as TopicDetail[];
          console.log(this.indexes);
          this.countPost = this.indexes.length;
          this.onPostDefaultDisplaying();
          this.notifyService.showNotif(responseObject.msg, 'confirm');
        }
      },
      error => {
        this.notifyService.showNotif(`Load my posts error: ${error}`, 'error');
      });
  }


  getOtherAvatar() {
    if (!this.otherProfile.backgroundKey) {
      this.otherAvatar = 'https://group-raiser-angular.s3.amazonaws.com/assets/test.jpg';
      return;
    }
    this.userService.downloadUserAvatar(this.otherProfile.uid)
      .pipe(first())
      .subscribe(data => {
          const responseObject: ResponseObject = data;

          if (responseObject.errMsg) {
            return;
          } else if (responseObject.msg) {
            console.log(responseObject);
            this.submitted = false;
            this.otherAvatar = 'data:image/jpeg;base64,' + responseObject.objects;
          }
        }, error => {
          this.submitted = false;
        }
      );
  }

  getOtherBackground() {
    if (!this.otherProfile.backgroundKey) {
      this.otherBackground = 'https://group-raiser-angular.s3.amazonaws.com/assets/new_bg.jpg';
      return;
    }
    this.userService.downloadUserBackground(this.otherProfile.uid)
      .pipe(first())
      .subscribe(data => {
          const responseObject: ResponseObject = data;
          if (responseObject.errMsg) {
            return;
          } else if (responseObject.msg) {
            this.submitted = false;
            this.otherBackground = 'data:image/jpeg;base64,' + responseObject.objects;
          }
        }, error => {
          this.submitted = false;
        }, () => {
          this.loading = false;
        }
      );
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

  gotoTopic(mid: number) {
    this.router.navigate(['/topic', {mid}]).then(res => {
      console.log(res);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(res => {
      console.log(res);
    });
  }
}
