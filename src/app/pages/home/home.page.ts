import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { IonicModule, ModalController, PopoverController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipsisVerticalOutline, logOutOutline, personAddOutline, chatbubblesOutline, callOutline, cameraOutline, addCircleOutline, videocamOutline } from 'ionicons/icons';
import { UserlistPage } from '../userlist/userlist.page';
import { NavigationExtras, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Observable, from, switchMap, } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EmptyScreenPage } from '../empty-screen/empty-screen.page';
import { Camera, CameraResultType, } from '@capacitor/camera'
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTab, MatTabsModule} from '@angular/material/tabs'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay,  OverlayModule} from '@angular/cdk/overlay';
import { MatLine, MatLineModule } from '@angular/material/core';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
// import *as WebRTC from 'webrtc'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserlistPage, EmptyScreenPage,MatToolbarModule,MatIconModule,MatLabel,MatListModule,MatCardModule,MatMenuModule,MatButtonModule,MatDialogModule,MatFormFieldModule,MatTabsModule,OverlayModule,MatTab,MatLineModule,MatLine,MatSidenavModule,MatSidenavContainer],
  providers:[MatDialog,MatDialogConfig,Overlay,]
})

export class HomePage implements OnInit {
  @ViewChild('new_chat') modal!: ModalController;
  @ViewChild('popover') popover!: PopoverController;
@ViewChild('localVideo') localVideo:any;
  @ViewChild('remoteVideo') remoteVideo:any;
  // private peerConnection: WebRTC.RTCPeerConnection;
  item: any;
  
selectedTabIndex: number = 0;
  statusList$: Observable<any[]>;
  imageSource: any;
  newStatus: string = '';
  segment = 'chats';
  open_new_chat = false;
selectedIndex = 0; 
  open_new_status = false
  users: Observable<any[]>;
  chatRoomId: string = 'your_chat_room_id';
  otherUserId: string = 'other_user_id';
  // chatRooms!:Observable<any[]>
  chatRooms$: Observable<any>;
  model = {
    icon: 'chatbubbles-outline',
    title: 'No chat rooms',
    color: 'danger'
  }
  constructor(private router: Router,
    private chatService: ChatService,
    private authservice: AuthService,

  ) { addIcons({ ellipsisVerticalOutline, logOutOutline, personAddOutline, chatbubblesOutline, callOutline, cameraOutline, addCircleOutline, videocamOutline }) 
// this.peerConnection=new WebRTC.RTCPeerConnection();
// this.peerConnection.onicecandidate=(event)=>{

// };
// this.peerConnection.onaddstream=(event)=>{
//   this.remoteVideo.nativeElement.srcObject=event.stream;
// };
// console.log(this.localVideo,'hiiiiiii')
// this.peerConnection.addStream(this.localVideo.nativeElement.srcObject);

// this.peerConnection.createOffer().then((offer)=>{
//   this.peerConnection.setLocalDescription(offer);
// })
}

  ngOnInit() {
    this.getRooms();
    this.getStatus();
  }

  getRooms() {
    this.chatRooms$ = this.chatService.getChatRooms().pipe(
      switchMap((rooms) => {
        return from(
          Promise.all(
            rooms.map(async (room) => {
              const members = await this.getMembersDetails(room.members);
              room.membersDetails = members;
              return room;
console.log('hellloooo')
            })
          )
        );

      })
    );

    this.chatRooms$.subscribe((rooms) => {
// console.log('Chat rooms:', rooms);
    });
  }


  async getMembersDetails(memberIds: string[]): Promise<any[]> {
    const membersDetailsPromises = memberIds.map(async (memberId) => {
      return await this.chatService.getUser(memberId).toPromise();

    });
    return await Promise.all(membersDetailsPromises);
  }

  async logout() {
    try {
      console.log('logout');
      if (this.popover) {
        await this.popover.dismiss();
      }
      await this.chatService.auth.logout();
      this.router.navigateByUrl('/login', { replaceUrl: true });

    } catch (e) {
      console.log(e);
    }
  }
  
  onTabChange(event: any) {
    if (event && event.detail) {
    this.segment = event.detail.value;
    }
  }
  onSegmentChanged(ev){
    if (ev && ev.detail){
      this.segment=ev.detail.value
    }
  }
  newChat() {
    this.open_new_chat = true
    if (!this.users) this.getUsers();
  }
  getUsers() {
    this.users = from(this.chatService.getUsers()).pipe(
      switchMap(() => this.chatService.users)
    );
  }
  onWillDismiss(ev) {

  }
  cancel() {
    this.modal.dismiss()
    this.open_new_chat = false
  }
  async startChat(item: any) {
    try {
      const room = await this.chatService.createChatRoom(item?.uid);
      // console.log('room :', room);
      this.cancel();
      const navData: NavigationExtras = {
        queryParams: {
          name: item?.name || 'New Chat'
        }
      };
      if (room && room.id) {
        this.router.navigate(['/', 'home', 'chats', room.id], navData);
      } else {
        console.log('room or room.id is undefined');
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getChat(item: any) {
    const members = item.members;

    if (!members || members.length === 0) {
      console.warn('Members array is empty for the chat room:', item.members);
      return;
    }

    const currentUserId = this.authservice.currentUser.uid;

    const otherUserId = members.find((member: any) => member !== currentUserId);

    if (otherUserId) {
      this.chatService.getUser(otherUserId).subscribe((otherUserDetails) => {
        // console.log('Other user details:', otherUserDetails);

        const navData: NavigationExtras = {
          queryParams: {
            otherUser: otherUserDetails
          }
        };

        if (item && item.id) {
          // console.log('Navigating to chat page with other user details:', navData);
          this.router.navigate(['/', 'home', 'chats', item.id], navData);
        } else {
          console.error('ID is undefined in the provided item:', item);
        }
      });
    } else {
      console.error('Other user not found in members array:', members);
    }
  }

  getUser(item: any) {
    const currentUser = this.authservice.currentUser.uid;
    const otherUserId = item?.members?.find((member: any) => member !== currentUser);
    const otherUser = item?.membersDetails?.find((user: any) => user.uid === otherUserId);
    return otherUser;
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    this.imageSource = image.webPath
  }
  async uploadStatus(status: string): Promise<void> {
    try {
      const image = this.imageSource;
      const currentUserId = this.chatService.currentUserId;
      const currentUser=await this.chatService.getUser(currentUserId).toPromise();
      const statusData = {
        status,
        userId: currentUserId,
        userName:currentUser.name,
        photo:currentUser.photo,
        // photo: image,
        createdAt: new Date(),
      };
      await this.chatService.uploadStatus(statusData);
      // console.log(statusData, 'status uploaded successfully')
    } catch (error) {
      console.log('error uploding status', error)
    }
  }
  status() {
    this.open_new_status = true;
  }
  cancelStatusUpdate() {
    this.open_new_status = false;
  }
  onStatusModalDismiss(ev) {
  }
  getStatus() {
    this.statusList$ = this.chatService.getStatus().pipe()
  }
newCall(){

}
  cancelCall(){}
}