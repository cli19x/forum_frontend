import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Topic} from '../_models/topic';
import {Router} from '@angular/router';
import {UserInfo} from '../_models/userInfo';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @Input() index: Topic;
  @Output() detailEvent = new EventEmitter<any>();
  currentUser: UserInfo;
  createDateString: string;
  dealDateString: string;
  constructor(private router: Router) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.createDateString = new Date(this.index.createTime).toLocaleString('en-US');
    this.dealDateString = new Date(this.index.dealDate)
      .toLocaleString('en-US',
        {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute : '2-digit'});
  }

  detailPost(id: number) {
    console.log(id);
    this.detailEvent.emit({ID: id});
  }

  seeOthers() {
    console.log(this.currentUser.uid === this.index.uid);
    if (this.currentUser.uid === this.index.uid) {
      console.log('self', this.currentUser.uid + '    ' + this.index.uid);
      this.router.navigate(['/profile', {uid: this.index.uid}]).then(res => {
        console.log(res);
      });
    } else {
      console.log('other');
      this.router.navigate(['/other-profile', {uid: this.index.uid}]).then(res => {
        console.log(res);
      });
    }
  }

}
