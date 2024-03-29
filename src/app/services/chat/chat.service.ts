import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable, interval } from 'rxjs';
import { ApiService } from '../api/api.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  currentUserId!: string;
  public users!: Observable<any>;
  chatRoom!: Observable<any>;
  public selectedChatRoomMessage: Observable<any>;
  constructor(
    public auth: AuthService,
    private api: ApiService,
  ) {
    this.getId();
    interval(86400000).subscribe(() => {
      this.cleanupExpireStatus();
    })
  }

  getId() {
    this.currentUserId = this.auth.getId();
  }


  async getUsers() {
    this.users = this.api.collectionDataQuery(
      'users',
      this.api.wherQuery('uid', '!=', this.currentUserId)
    );
  }

  async createChatRoom(user_id: any) {
    try {
      let room: any;
      const querySnapshot = await this.api.getDocs('chatRooms', this.api.wherQuery('members', 'in', [[user_id, this.currentUserId], [this.currentUserId, user_id]]));
      room = querySnapshot.docs.map((doc: any) => {
        let item = doc.data();
        item.id = doc.id;
        return item;
      });
      console.log('exist docs', room);
      if (room?.length > 0) {
        room = room[0];
      } else {
        const data = {
          members: [this.currentUserId, user_id],
          type: 'private',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        room = await this.api.addDocument('chatRooms', data);
      }
      const currentUserDoc = await this.api.getDocById(`user/${this.currentUserId}`);
      const otherUserDoc = await this.api.getDocById(`user/${user_id}`);

      const currentUser = currentUserDoc.data();
      const otherUser = otherUserDoc.data();

      room.currentUser = currentUser;
      room.otherUser = otherUser;
      return room;
    } catch (e) {
      throw (e)
    }
  }

  getChatRooms(): Observable<any[]> {
    return this.api.collectionDataQuery('chatRooms', this.api.wherQuery('members', 'array-contains', this.currentUserId));
  }


  getChatRoomMessages(chatRoomId) {
    this.selectedChatRoomMessage = this.api.collectionDataQuery(
      `chats/${chatRoomId}/messages`,

      this.api.orderByQuery('createdAt', 'desc')
    )
      .pipe(map((arr: any) => arr.reverse()))
  }
  async sendMessage(chatId, msg) {
    try {
      const new_message = {
        message: msg,
        sender: this.currentUserId,
        createdAt: new Date()
      };
      // console.log(chatId);
      if (chatId) {
        await this.api.addDocument(`chats/${chatId}/messages`, new_message);
      }
    } catch (e) {
      throw (e)
    }
  }
  async getChatRoomMembersDetails(chatRoomId: string): Promise<any[]> {
    try {
      const memberIds = await this.getChatRoomMembers(chatRoomId);
      const membersDetails = await Promise.all(memberIds.map(memberId => this.getUser(memberId).toPromise()));
      return membersDetails;
    } catch (error) {
      console.error('Error fetching chat room members details:', error);
      throw error;
    }
  }
  async getChatRoomMembers(chatRoomId: string): Promise<any[]> {
    try {
      const chatRoomDoc = await this.api.getDocById(`chatRooms/${chatRoomId}`);
      if (chatRoomDoc.exists()) {
        const chatRoomData = chatRoomDoc.data();
        const members = chatRoomData['members'] || [];
        console.log('Fetched members for chat room:', members);
        return members;
      } else {
        console.warn('Chat room document not found:', chatRoomId);
        return [];
      }
    } catch (error) {
      console.error('Error fetching chat room members:', error);
      throw error;
    }
  }
  getUser(userId: string): Observable<any> {
    return this.api.getDocument(`users/${userId}`).pipe(
      map((userDoc: any) => userDoc.data())
    );
  }
  async uploadStatus(statusData: any): Promise<void> {
    try{
 const userId =this.currentUserId;
await this.api.addDocument('status',statusData)
// console.log(statusData,'uploaded successfully')
    }catch(e){
      console.log('error uploading status',e)
      throw e
    }
   }



  getStatus(): Observable<any[]> {
    return this.api.collectionDataQuery('status').pipe(
      map((status: any[]) => {
        return status.map(status => ({
          photo: status.photo,
          userName: status.userName,
          status: status.status
        }));
      })
    );
  }
  async cleanupExpireStatus() {
    try {
      const status = await this.api.getDocs('status');
      const now = new Date();
      status.forEach(async (statusDoc) => {
        const statusData = statusDoc.data();
        const createdAt = statusData.createdAt.toDate();
        if ((now.getTime() - createdAt.getTime()) > 86400000) {
          await this.api.deleteDocument(`status/${statusDoc.id}`)
        }
      })
    } catch (e) {
      console.log('error cleanig up the status')
      throw e
    }
  }


}
