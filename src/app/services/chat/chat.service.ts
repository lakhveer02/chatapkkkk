import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable,forkJoin,of } from 'rxjs';
import { ApiService } from '../api/api.service';
import { map,switchMap } from 'rxjs/operators';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  currentUserId!: string;
  public users!: Observable<any>;
 chatRoom!: Observable<any>;

  constructor(
    public auth: AuthService,
    private api: ApiService,
  ) {
    this.getId();
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
      const querySnapshot = await this.api.getDocs(
        'chatRooms',
        this.api.wherQuery(
          'members',
          'in',
          [[user_id, this.currentUserId], [this.currentUserId, user_id]]
        )
      );
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
  
      const currentUserDoc = await this.api.getDocById(`users/${this.currentUserId}`);
      const otherUserDoc = await this.api.getDocById(`users/${user_id}`);
      
      const currentUser = currentUserDoc.data();
      const otherUser = otherUserDoc.data();
  
      room.currentUser = currentUser;
      room.otherUser = otherUser;
  
      return room;
    } catch (e) {
      throw (e);
    }
  }
  
  getChatRooms() {
    this.chatRoom = this.api.collectionDataQuery( 
      'chatRooms',
      this.api.wherQuery('members', 'array-contains', this.currentUserId)
    )

    }
}