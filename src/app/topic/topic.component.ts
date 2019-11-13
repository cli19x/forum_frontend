import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Post} from '../_models/post';
import {User} from '../_models/user';
import {AuthService} from '../_services';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'topic-component',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit {
  @Input() topic: Post;
  @Output() deleteEvent = new EventEmitter<any>();
  currentUser: User;
  @ViewChild('postContent', {static: true}) post: any;
  isHidden = true;
  visible = 'collapse';
  heightNow = '0';
  constructor(private authService: AuthService) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }


  ngOnInit() {
    this.isHidden = true;
    console.log(`posts: ${this.topic.id}`);
    console.log(`haha  ${this.currentUser.userId}`);
    console.log(`topic  ${this.topic.userId}`);
  }

  toggle() {
    this.isHidden = !this.isHidden;
    if (this.isHidden) {
      this.visible = 'collapse';
      this.heightNow = '0';
    }
    if (!this.isHidden) {
      this.visible = 'visible';
      this.heightNow = 'auto';
    }
  }

  onPost(postContent: string) {

  }
  deletePost(id: number, level: number) {
    console.log(id);
    this.deleteEvent.emit({ID: id, LEVEL: level});
  }

  isSelf() {
    return this.currentUser.userId === this.topic.userId;
  }
}
