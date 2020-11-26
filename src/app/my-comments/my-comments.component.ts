import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommentDetail} from '../_models/commentDetail';
@Component({
  selector: 'app-my-comments',
  templateUrl: './my-comments.component.html',
  styleUrls: ['./my-comments.component.css']
})
export class MyCommentsComponent implements OnInit {
  @Input() myComment: CommentDetail;
  @Output() detailEvent = new EventEmitter<number>();
  @Output() userEvent = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

  toDetail(mid: number, pid: number) {
    mid === -1 ? this.detailEvent.emit(pid) : this.detailEvent.emit(mid);
  }

  toUser(uid: string) {
    this.userEvent.emit(uid);
  }
}
