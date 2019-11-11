import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {NotificationService, AuthService} from '../_services';
import {Post} from '../_models/post';
import {PostService} from '../_services/post.service';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {User} from '../_models/user';
import {Router} from '@angular/router';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'topic-component',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit {
  @Input() topic: Post;
  @Output() deleteEvent = new EventEmitter<string>();
  currentUser: User;
  @ViewChild('postContent', {static: true}) post: any;
  isHidden: boolean;

  constructor(private notifService: NotificationService,
              private authService: AuthService,
              private dialog: MatDialog,
              private router: Router,
              private postService: PostService) {
  }


  ngOnInit() {
    this.isHidden = true;
    console.log(`posts: ${this.topic.id}`);
  }

  toggle() {
    this.isHidden = !this.isHidden;
  }

  onPost(postContent: string) {

  }

  deleteThis() {
    this.deletePost();
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deletePost();
      }
    });
  }

  deletePost() {
    this.postService.delPost(this.topic.id).subscribe(
      del => {
        console.log(del);
        const {errMsg, msg} = del;
        if (errMsg) {
          this.notifService.showNotif(`Delete error: ${errMsg}`, 'error');
        } else if (msg) {
          console.log(msg);
          if (this.topic.level === 1) {
            console.log('ni ma bi');
            this.router.navigate(['/']).then(res => {console.log(res);
            });
          } else {
            this.router.navigate(['/topic']).then(res => {console.log(res); });
          }
        }
      },
      error => {
        this.notifService.showNotif(`Delete error: ${error}`, 'error');
      });
  }
  isSelf() {
    console.log(`haha  ${this.currentUser.userId}`);
    console.log(`topic  ${this.topic.userId}`);
    return this.currentUser.userId === this.topic.userId;
  }
}
