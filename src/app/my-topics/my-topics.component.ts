import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Index} from '../_models';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'my-topic-app',
  templateUrl: './my-topics.component.html',
  styleUrls: ['./my-topics.component.css']
})

export class MyTopicsComponent implements OnInit {
  @Input() myTopic: Index;
  @Output() detailEvent = new EventEmitter<number>();
  constructor() {}
  ngOnInit() {
  }
  gotoDetail(id: number) {
    this.detailEvent.emit(id);
  }
}
