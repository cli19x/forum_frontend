import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MyComment} from '../_models/myComment';
import {Post} from '../_models/post';

@Component({
  selector: 'app-my-comments',
  templateUrl: './my-comments.component.html',
  styleUrls: ['./my-comments.component.css']
})
export class MyCommentsComponent implements OnInit {
  @Input() myComment: Post;
  @Output() commentEvent = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
    console.log(this.myComment);
  }

  toDetail(id: number) {
    console.log(id);
    this.commentEvent.emit(id);
  }

}
