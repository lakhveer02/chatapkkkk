import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
public _uid=new BehaviorSubject<any>(null);
currentUser:any;
  constructor(private fireAuth:Auth,private apiServie:ApiService) { }
  async login(email:string,password:string):Promise<any>{
    try{
      const response= await signInWithEmailAndPassword(this.fireAuth,email,password);
      console.log(response);
      if(response?.user){
        this.setUserData(response.user.uid)
      }
    }catch(e){
      throw(e)
    }
  }
getId(){
  const auth = getAuth();
  this.currentUser=auth.currentUser;
  // console.log(this.currentUser)
  return this.currentUser?.uid
}
setUserData(uid:any){
  this._uid.next(uid);
}
rendomIntFormInterval(min:any,max:any){
  return Math.floor(Math.random()*(max -min +1)+min)
}
async register(formValue: any) {
  try {
    const registeredUser = await createUserWithEmailAndPassword(this.fireAuth, formValue.email, formValue.password);
    console.log('userregister', registeredUser);
    
    const username = formValue.username ? formValue.username : 'Unknown'; 

    const data = {
      email: formValue.email,
      name: username, 
      uid: registeredUser.user.uid,
      photo: 'https://i.pravatar.cc/' + this.rendomIntFormInterval(200, 400)
    };

    await this.apiServie.setDocument(`users/${registeredUser.user.uid}`, data);
    const userData = {
      id: registeredUser.user.uid
    };
    return userData;
  } catch (e) {
    throw (e);
  }
}


async resetPassword(email:string){
  try{
    await sendPasswordResetEmail( this.fireAuth ,email);
  }catch(e){
    throw(e)
  }
}
async logout(){
  try{
    await this.fireAuth.signOut();
    this._uid.next(null);
    return true;
  }catch(e){
    throw(e)
  }
}
cheakAuth():Promise<any>{
  return new Promise((resolve,reject)=>{
    onAuthStateChanged(this.fireAuth,user=>{
      resolve(user)
    })
  })
}
async getUserData(id:any){
  const docSnap : any =await this.apiServie.getDocById(`user/${id}`);
  if(docSnap?.exists()){
    return docSnap.data()
  }else{
    throw('No such document exists')
  }
}
}
