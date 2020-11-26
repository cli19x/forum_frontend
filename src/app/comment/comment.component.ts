import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommentDetail} from '../_models/commentDetail';
import {Router} from '@angular/router';
import {AuthService} from '../_services';
import {UserInfo} from '../_models/userInfo';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: CommentDetail;
  @Output() deleteComment = new EventEmitter<any>();
  currentUser: UserInfo;
  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  seeOthers() {
    if (this.currentUser.uid === this.comment.uid) {
      this.router.navigate(['/profile', {uid: this.comment.uid}]).then(res => {
        console.log(res);
      });
    } else {
      this.router.navigate(['/other-profile', {uid: this.comment.uid}]).then(res => {
        console.log(res);
      });
    }
  }

  isSelf() {
    return this.comment.uid === this.currentUser.uid;
  }

  onCommentDelete(cid: number) {
    this.deleteComment.emit({CID: cid, PID: this.comment.pid});
  }

}
