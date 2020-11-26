import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TopicDetail} from '../_models/topicDetail';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'my-topic-app',
  templateUrl: './my-topics.component.html',
  styleUrls: ['./my-topics.component.css']
})

export class MyTopicsComponent implements OnInit {
  @Input() myTopic: TopicDetail;
  @Output() detailEvent = new EventEmitter<number>();
  constructor() {}
  ngOnInit() {
  }

  toDetail(pid: number) {
    console.log(pid);
    this.detailEvent.emit(pid);
  }
}
