import {UserService} from '../_services';
import {AuthService} from '../_services';
import {NotificationService} from '../_services';
import {TopicDetail} from '../_models/topicDetail';
import {first} from 'rxjs/operators';
import {EventService} from '../_services/event.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Topic} from '../_models/topic';
import {UserInfo} from '../_models/userInfo';
import {ResponseObject} from '../_models/responseObject';
import { formatDate } from '@angular/common';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('slideshow', {static: true}) sideshow: any;
  postForm: FormGroup;
  currentUser: UserInfo;
  indexes: Topic[] = [];
  filteredIndexes: Topic[] = [];
  displayingIndexes: Topic[] = [];
  count = 0;
  currentItemPerPage = 20;
  currentPageIndex = 0;
  numberOfPages: number[] = [10, 20, 30, 50];
  moving = false;
  imgSrc = 'https://group-raiser-angular.s3.amazonaws.com/assets/ic_up_arrow.png';
  imgSrc2 = 'https://group-raiser-angular.s3.amazonaws.com/assets/ic_down_arrow.png';
  currentImageIndex = -1;
  isInvalid = false;
  errorMessage = '';
  imageSources: Array<string>;
  linkSources: Array<string>;
  currentUrl: string;
  submitted = false;
  loading = false;

  filterStartTime = '00:00';
  filterEndTime = '23:59';
  week = '1,2,3,4,5,6,7';
  MondayToggle = true;
  TuesdayToggle = true;
  WednesdayToggle = true;
  ThursdayToggle = true;
  FridayToggle = true;
  SaturdayToggle = true;
  SundayToggle = true;
  tomorrow: any;
  minDate: any;
  minTime: any;

  constructor(
    private postService: EventService,
    private userService: UserService,
    private authService: AuthService,
    private notifyService: NotificationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.tomorrow = new Date(Date.now());
    this.tomorrow.setDate(new Date().getDate() + 1);
    this.minDate = formatDate(this.tomorrow, 'yyyy-MM-dd', 'en');
    this.minTime = formatDate(this.tomorrow, 'HH:mm', 'en');
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      date: [formatDate(this.tomorrow, 'yyyy-MM-dd', 'en'), Validators.required],
      time: [formatDate(this.tomorrow, 'HH:mm', 'en'), Validators.required]
    });
    this.imageSources = ['https://group-raiser-angular.s3.amazonaws.com/assets/test1.jpg',
      'https://group-raiser-angular.s3.amazonaws.com/assets/test2.jpg',
      'https://group-raiser-angular.s3.amazonaws.com/assets/test3.jpg'];
    this.linkSources = ['https://na.leagueoflegends.com/en/',
      'http://blog.dota2.com/?l=english',
      'https://www.pokemongo.com/en-us/'];
    this.getAllIndexes();
    if (localStorage.getItem('Monday') != null) {
      this.MondayToggle = localStorage.getItem('Monday') === 'true';
      this.TuesdayToggle = localStorage.getItem('Tuesday') === 'true';
      this.WednesdayToggle = localStorage.getItem('Wednesday') === 'true';
      this.ThursdayToggle = localStorage.getItem('Thursday') === 'true';
      this.FridayToggle = localStorage.getItem('Friday') === 'true';
      this.SaturdayToggle = localStorage.getItem('Saturday') === 'true';
      this.SundayToggle = localStorage.getItem('Sunday') === 'true';
      this.filterStartTime = localStorage.getItem('StartTime').toString();
      this.filterEndTime = localStorage.getItem('EndTime').toString();
      console.log(localStorage.getItem('StartTime').toString());
    }
  }

  getAllIndexes() {
    this.postService.getTopics().subscribe(
      topics => {
        const responseObject: ResponseObject = topics;
        if (responseObject.errMsg) {
          this.notifyService.showNotif(`Load topics error: ${responseObject.errMsg}`, 'error');
        } else if (responseObject.msg) {
          this.indexes = responseObject.objects as Topic[];
          this.filteredIndexes = this.indexes;
          this.filterStart();
          this.count = this.filteredIndexes.length;
          this.onDefaultDisplaying();
          this.notifyService.showNotif(responseObject.msg, 'confirm');
        } else {
          this.notifyService.showNotif(`Load topics error: ${responseObject.errMsg}`, 'error');
        }
      },
      error => {
        this.notifyService.showNotif(`Load topics error: ${error}`, 'error');
      });
  }

  get f() {
    return this.postForm.controls;
  }

  onSubmit() {
    this.isInvalid = false;
    this.submitted = true;
    if (this.postForm.invalid) {
      this.errorMessage = 'Fields must not be Empty';
      this.isInvalid = true;
      return;
    } else {
      if (!this.f.title.value.replace(/\s/g, '').length) {
        this.errorMessage = 'Invalid input in title';
        this.isInvalid = true;
        return;
      } else if (!this.f.content.value.replace(/\s/g, '').length) {
        this.errorMessage = 'Invalid input in Main Content';
        this.isInvalid = true;
        return;
      } else if (!this.f.date.value.replace(/\s/g, '').length) {
        this.errorMessage = 'Invalid input in Date';
        this.isInvalid = true;
        return;
      } else if (!this.f.time.value.replace(/\s/g, '').length) {
        this.errorMessage = 'Invalid input in Time';
        this.isInvalid = true;
        return;
      }
    }
    this.loading = true;
    const post: TopicDetail = {
      pid: 0,
      uid: this.currentUser.uid,
      mid: -1,
      createTime: undefined,
      nickname: this.currentUser.nickname,
      postTitle: this.f.title.value,
      postData: this.f.content.value,
      commentCount: 0,
      dealDate: new Date(`${this.f.date.value}T${this.f.time.value}`).toISOString(),
      week: 0,
      levelCount: undefined,
      commentDetailList: undefined
    };
    this.count++;
    console.log(post);
    this.postService.postTopicOrPost(post)
      .pipe(first())
      .subscribe(newPost => {
          const responseObject: ResponseObject = newPost;
          if (responseObject.errMsg) {
            this.notifyService.showNotif(`Post error: ${responseObject.errMsg}`, 'error');
            this.loading = false;
            this.logout();
          } else if (responseObject.msg) {
            this.getAllIndexes();
            this.notifyService.showNotif(responseObject.msg, 'confirm');
            this.loading = false;
            window.scrollTo(0, 0);
            this.postForm.reset();
          }
        },
        error => {
          this.notifyService.showNotif(`Post error: ${error}`, 'error');
          this.loading = false;
        }
      );
  }

  filterStart() {
    this.week = '';
    this.week += this.MondayToggle ? '1,' : '';
    this.week += this.TuesdayToggle ? '2,' : '';
    this.week += this.WednesdayToggle ? '3,' : '';
    this.week += this.ThursdayToggle ? '4,' : '';
    this.week += this.FridayToggle ? '5,' : '';
    this.week += this.SaturdayToggle ? '6,' : '';
    this.week += this.SundayToggle ? '7,' : '';
    if (this.week === '') {
      this.notifyService.showNotif('Select at least one day of the week', 'error');
      return;
    }
    if (this.filterStartTime >= this.filterEndTime) {
      this.notifyService.showNotif('Invalid time interval input', 'error');
      return;
    }
    localStorage.removeItem('Monday');
    localStorage.removeItem('Tuesday');
    localStorage.removeItem('Wednesday');
    localStorage.removeItem('Thursday');
    localStorage.removeItem('Friday');
    localStorage.removeItem('Saturday');
    localStorage.removeItem('Sunday');
    localStorage.removeItem('StartTime');
    localStorage.removeItem('EndTime');
    localStorage.setItem('Monday', String(this.MondayToggle));
    localStorage.setItem('Tuesday', String(this.TuesdayToggle));
    localStorage.setItem('Wednesday', String(this.WednesdayToggle));
    localStorage.setItem('Thursday', String(this.ThursdayToggle));
    localStorage.setItem('Friday', String(this.FridayToggle));
    localStorage.setItem('Saturday', String(this.SaturdayToggle));
    localStorage.setItem('Sunday', String(this.SundayToggle));
    localStorage.setItem('StartTime', this.filterStartTime);
    localStorage.setItem('EndTime', this.filterEndTime);

    this.filteredIndexes = this.indexes.filter(e =>
      new Date(e.dealDate).toLocaleString('it-IT',
        {hour: '2-digit', minute: '2-digit'}) > this.filterStartTime
    && new Date(e.dealDate).toLocaleString('it-IT',
      {hour: '2-digit', minute: '2-digit'}) < this.filterEndTime
    && this.week.split(',').includes(new Date(e.dealDate).getDay() + ''));

    this.onDefaultDisplaying();
  }

  onActivateUp() {
    this.moving = true;
    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 80);
      } else {
        window.clearInterval(scrollToTop);
        this.moving = false;
      }
    }, 16);
  }

  onActivateDown() {
    window.scrollTo(0, document.documentElement.scrollHeight);
  }

  display($event) {
    this.currentImageIndex = $event;
    switch ($event) {
      case 0:
        this.currentUrl = this.imageSources[0];

        break;
      case 1:
        this.currentUrl = this.imageSources[1];
        this.getUrl();
        break;
      case 2:
        this.currentUrl = this.imageSources[2];
        this.getUrl();
        break;
    }
  }

  getUrl() {
    return this.currentUrl;
  }

  profile() {
    this.router.navigate(['/profile']).then(res => {
      console.log(res);
    });
  }

  gotoAdsLink($event) {
    if ($event.path[0].className === 'arrow prev' || $event.path[0].className === 'arrow-container prev') {
      console.log('left');
      return;
    }
    if ($event.path[0].className === 'arrow next' || $event.path[0].className === 'arrow-container next') {
      console.log('right');
      return;
    }
    if ($event.path[0].tagName === 'BUTTON') {
      return;
    }
    console.log($event);
    console.log(this.linkSources[this.currentImageIndex]);
    window.open(this.linkSources[this.currentImageIndex], '_blank');
  }

  onPaginateChange($event) {
    this.currentItemPerPage = $event.pageSize;
    this.currentPageIndex = $event.pageIndex;
    const startIndex = this.currentPageIndex * this.currentItemPerPage;
    const endIndex = (this.currentItemPerPage) * this.currentPageIndex + this.currentItemPerPage;
    if (endIndex <= this.filteredIndexes.length) {
      this.displayingIndexes = this.filteredIndexes.slice(startIndex, endIndex);
    } else {
      this.displayingIndexes = this.filteredIndexes.slice(startIndex);
    }
  }

  onDefaultDisplaying() {
    if (this.currentItemPerPage <= this.filteredIndexes.length) {
      this.displayingIndexes = this.filteredIndexes.slice(0, this.currentItemPerPage);
    } else {
      this.displayingIndexes = this.filteredIndexes.slice(0);
    }
  }

  charCountTitle() {
    if (this.f.title.value) {
      return this.f.title.value.toString().length;
    }
  }

  detailPage(info: any) {
    const {ID} = info;
    this.router.navigate(['/topic', {mid: ID}]).then(res => {
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

