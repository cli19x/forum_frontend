import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Topic} from '../_models/topic';
import {NotificationService, AuthService} from '../_services';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'topic-component',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit {
  @Input() topic: Topic;

  constructor(private notifService: NotificationService, private authService: AuthService, ) {}


  ngOnInit() {
  }

  isSelf() {
    return this.authService.currentUserValue.sessionId === this.topic.postedBy.sessionId;
  }
}
