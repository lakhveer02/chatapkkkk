import { Component, Input, OnInit, ViewChild ,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { send, chatbubblesOutline } from 'ionicons/icons';
import { ChatBoxPage } from '../chat-box/chat-box.page';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat/chat.service';
import { EmptyScreenPage } from '../empty-screen/empty-screen.page';
import { MatIconModule } from '@angular/material/icon';
import {MatSidenavContainer, MatSidenavModule} from '@angular/material/sidenav'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import {MatExpansionModule, MatExpansionPanel,MatExpansionPanelHeader,MatExpansionPanelTitle}from '@angular/material/expansion'
import {MatSpinner} from '@angular/material/progress-spinner'
// import {MatExpandPanel} from '@angular/material/expansion'
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ChatBoxPage, EmptyScreenPage,MatIconModule,MatSidenavContainer,MatSidenavModule,MatToolbarModule,RouterOutlet,MatButtonToggleModule,MatExpansionPanel,MatExpansionPanelHeader,MatExpansionModule,MatSpinner,]
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  id: string;
  name: string;
  otherUserPhoto: any
  message!: string;
  chats: Observable<any[]>;
  isLoading!: boolean;
  model = {
    icon: 'chatbubbles-outline',
    title: 'No Conversation',
    color: 'success'
  };
  constructor(private route: ActivatedRoute, private navCtrl: NavController, public chatService: ChatService,private router :Router) { addIcons({ send, chatbubblesOutline }) }

  ngOnInit() {
    this.name = this.route.snapshot.queryParams['name'];
    this.otherUserPhoto = this.route.snapshot.queryParams['photo'];

    const id = this.route.snapshot.paramMap.get('id');
    // console.log('Cheak id', id);
    if (!id) {
      this.navCtrl.back();
      return
    }
    this.id = id;
    this.chatService.getChatRoomMessages(this.id);
    this.chats = this.chatService.selectedChatRoomMessage;
    // console.log(this.chats)
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    if (this.chats) this.content.scrollToBottom(500);
  }
  async sendMessage() {
    if (!this.message || this.message?.trim() == '') {
      return
    }
    try {
      this.isLoading = true;
      await this.chatService.sendMessage(this.route.snapshot.paramMap.get('id'), this.message);
      this.message = '';
      this.isLoading = false;
      this.scrollToBottom();
    } catch (e) {
      this.isLoading = false
      throw (e)
    }
  }
  goBack(){
    this.router.navigate(['/home']);
  }
}
