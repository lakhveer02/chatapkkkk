import { Component, OnInit,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {checkmarkDoneOutline} from 'ionicons/icons';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider'
import {MatListModule} from '@angular/material/list'
@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.page.html',
  styleUrls: ['./chat-box.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,MatIconModule,MatDividerModule,MatListModule]
})
export class ChatBoxPage implements OnInit {

  constructor() {addIcons({checkmarkDoneOutline}) }
  @Input() chat:any;
  @Input() current_user_id:any;
  ngOnInit() {
  }

}
