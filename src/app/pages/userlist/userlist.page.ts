import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.page.html',
  styleUrls: ['./userlist.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UserlistPage implements OnInit {
@Input() item:any;
@Output() onClick:EventEmitter<any>= new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  redirect(){
    this.onClick.emit(this.item)
  }
}
