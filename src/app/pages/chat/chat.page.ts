import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {send,} from 'ionicons/icons';
import { ChatBoxPage } from '../chat-box/chat-box.page';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ChatBoxPage]
})
export class ChatPage implements OnInit {
name:string='Sender';
message!:string;
isLoading!:false;
CurrentUserId=1
chats=[
  {id:1,sender:1 ,message:'hlo'},
  {id:2,sender:2 ,message:'hiiii'}
]
  constructor() {addIcons({send,}) }

  ngOnInit() {
  }
  sendMessage(){

  }

}
