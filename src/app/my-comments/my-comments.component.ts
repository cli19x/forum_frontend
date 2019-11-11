import {Component, Input, OnInit} from '@angular/core';
import {MyComment} from '../_models/myComment';
import {Post} from '../_models/post';

@Component({
  selector: 'app-my-comments',
  templateUrl: './my-comments.component.html',
  styleUrls: ['./my-comments.component.css']
})
export class MyCommentsComponent implements OnInit {
  @Input() myComment: Post;
  constructor() { }

  ngOnInit() {
  }

}
