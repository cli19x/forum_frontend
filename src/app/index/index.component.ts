import {Component, Input, OnInit} from '@angular/core';
import {Index} from '../_models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @Input() index: Index;
  constructor() { }

  ngOnInit() {
  }

}
