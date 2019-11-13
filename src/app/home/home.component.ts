import {User} from '../_models/user';
import {UserService} from '../_services';
import {AuthService} from '../_services';
import {NotificationService} from '../_services';
import {Post} from '../_models/post';
import {first} from 'rxjs/operators';
import {PostService} from '../_services/post.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Index} from '../_models';

@Component({
  templateUrl: 'home.component.html',

  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('slideshow', {static: true}) slideshow: any;
  postForm: FormGroup;
  currentUser: User;
  indexes: Index[] = [];
  displayingIndexes: Index[] = [];
  count = 0;
  currentItemPerPage = 20;
  currentPageIndex = 0;
  numberOfPages: number[] = [10, 20, 30, 50];
  moving = false;
  imgSrc = 'https://angularcli.s3.amazonaws.com/asserts/img/ic_up_hover.png';
  imgSrc2 = 'https://angularcli.s3.amazonaws.com/asserts/img/ic_down_hover.png';
  currentImageIndex = -1;
  isInvalid = false;
  errorMessage = '';
  imageSources: Array<string>;
  linkSources: Array<string>;
  currentUrl: string;
  submitted = false;
  loading = false;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private authService: AuthService,
    private notifService: NotificationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

    // Observing currentUser. We will need it to get user's id.
    this.authService.currentUser.subscribe(x => this.currentUser = x);

  }

  ngOnInit() {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
    this.imageSources = ['https://angularcli.s3.amazonaws.com/asserts/img/test1.jpg',
      'https://angularcli.s3.amazonaws.com/asserts/img/test2.jpg',
      'https://angularcli.s3.amazonaws.com/asserts/img/test3.jpg'];
    this.linkSources = ['https://na.leagueoflegends.com/en/', 'http://blog.dota2.com/?l=english', 'https://www.pokemongo.com/en-us/'];
    this.getAllIndexes();
  }

  getAllIndexes() {
    this.postService.getIndexes().subscribe(
      indexes => {
        console.log(indexes);
        const {errMsg, msg, objects} = indexes;
        if (errMsg) {
          this.notifService.showNotif(`Load topics error: ${errMsg}`, 'error');
        } else if (msg) {
          console.log(msg);
          console.log(objects);
          this.indexes = objects;
          console.log(this.indexes);
          this.count = this.indexes.length;
          this.onDefaultDisplaying();
        }
      },
      error => {
        this.notifService.showNotif(`Load topics error: ${error}`, 'error');
      });
  }

  get f() {
    return this.postForm.controls;
  }

  onSubmit() {
    this.isInvalid = false;
    this.submitted = true;
    if (this.postForm.invalid) {
      this.errorMessage = 'Both filed must not be Empty';
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
      }
    }

    this.loading = true;
    const post: Post = {
      token: this.currentUser.token,
      postTitle: this.f.title.value,
      postData: this.f.content.value,
      createTime: undefined,
      postId: -1,
      commentCount: 0,
      id: undefined,
      level: undefined,
      nickName: undefined,
      motherPostId: undefined,
      userId: undefined
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
            this.getAllIndexes();
            this.notifService.showNotif('Post success', 'confirm');
            this.loading = false;
            window.scrollTo(0, 0);
            this.postForm.reset();
          }
        },
        error => {
          this.notifService.showNotif(`Post error: ${error}`, 'error');
          this.loading = false;
        }
      );
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
    this.router.navigate(['/profile']);
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
    if (endIndex <= this.indexes.length) {
      this.displayingIndexes = this.indexes.slice(startIndex, endIndex);
    } else {
      this.displayingIndexes = this.indexes.slice(startIndex);
    }
  }

  onDefaultDisplaying() {
    if (this.currentItemPerPage <= this.indexes.length) {
      this.displayingIndexes = this.indexes.slice(0, this.currentItemPerPage);
    } else {
      this.displayingIndexes = this.indexes.slice(0);
    }
  }

  charCountTitle() {
    return this.f.title.value.toString().length;
  }

  onShowDetail(data: Index) {
    this.router.navigate(['/topic', {id: data.id}]).then(res => {
      console.log(res);
    });
  }
}

