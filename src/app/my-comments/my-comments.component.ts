import {Component, Input, OnInit} from '@angular/core';
import {MyComment} from '../_models/myComment';

@Component({
  selector: 'app-my-comments',
  templateUrl: './my-comments.component.html',
  styleUrls: ['./my-comments.component.css']
})
export class MyCommentsComponent implements OnInit {
  @Input() myComment: MyComment;
  constructor() { }

  ngOnInit() {
  }

}
