import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule ,ModalController,PopoverController} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {ellipsisVerticalOutline,logOutOutline,personAddOutline} from 'ionicons/icons';
import { UserlistPage } from '../userlist/userlist.page';
import { NavigationExtras, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,UserlistPage]
})

export class HomePage implements OnInit {
  @ViewChild('new_chat') modal!: ModalController;
  @ViewChild('popover') popover!: PopoverController;
  
  
segment='chats';
open_new_chat=false;
users!:Observable<any[]>
chatRooms!:Observable<any[]>

  constructor(private router:Router
    ,private chatService:ChatService) { addIcons({ellipsisVerticalOutline,logOutOutline,personAddOutline})}

  ngOnInit() {
    this.getRooms()   
  }
  async getRooms() {
    await this.chatService.getChatRooms();
    this.chatRooms = this.chatService.chatRoom;
    console.log('chatrooms', this.chatRooms);
  }
  
async logout(){
  try{
  console.log('logout')
  this.popover.dismiss()
 await this.chatService.auth.logout();
 this.router.navigateByUrl('/login',{replaceUrl:true});

}catch(e){
  console.log(e)
}
} 
onSegmentChanged(event:any){
  console.log(event)
}
newChat(){
  this.open_new_chat=true
  if(!this.users) this.getUsers();
}
getUsers(){
  this.chatService.getUsers();
  this.users=this.chatService.users;
}
onWillDismiss(event:any){

}
cancel(){
  this.modal.dismiss()
  this.open_new_chat=false  
}
 async startChat(item:any){
  try{
    const room=await this.chatService.createChatRoom(item?.uid);
    console.log('room :',room)
    this.cancel();
    const navData:NavigationExtras={
      queryParams:{
        name:item?.name
      }
    };
if(room && room.id){
  this.router.navigate(['/','home','chats',room.id],navData);
}else{
  console.log('room or room.id is undfiend')
}
  }catch(e){
    console.log(e);
  }
}
getChat(item:any){
  this.router.navigate(['/','home','chats',item?.id])
}
getUser(user: any) {
  return user.data(); 
}
}
