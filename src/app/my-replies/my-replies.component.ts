import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TopicDetail} from '../_models/topicDetail';

@Component({
  selector: 'app-my-replies',
  templateUrl: './my-replies.component.html',
  styleUrls: ['./my-replies.component.css']
})
export class MyRepliesComponent implements OnInit {
  @Input() myReply: TopicDetail;
  @Output() detailEvent = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {

  }

  toDetail(pid: number) {
    console.log(pid);
    this.detailEvent.emit(pid);
  }

}
