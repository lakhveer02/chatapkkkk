import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, collectionData, where, collection, query, addDoc, QuerySnapshot, getDocs, docData, OrderByDirection, orderBy, deleteDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private firestore: Firestore) { }
  docRef(path: any) {
    return doc(this.firestore, path)
  }

  getDocument(path: string): Observable<any> {
    return from(getDoc(doc(this.firestore, path)));
  }

  collectionRef(path: any) {
    return collection(this.firestore, path)
  }

  setDocument(path: any, data: any) {
    const dataRef = this.docRef(path);
    return setDoc<any, any>(dataRef, data)
  }
  addDocument(path: any, data: any) {
    const dataRef = this.collectionRef(path);
    return addDoc<any, any>(dataRef, data)
  }
  getDocById(path: any) {
    const dataRef = this.docRef(path);
    return getDoc(dataRef)
  }
  async getDocs(path: any, queryFn?: any): Promise<QuerySnapshot<any>> {
    let queryRef: any = collection(this.firestore, path);
    if (queryFn) {
      queryRef = query(queryRef, queryFn);
    }
    return getDocs(queryRef);
  }
  collectionDataQuery(path: any, queryFn?: any) {
    let dataRef: any = this.collectionRef(path);
    if (queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }

    const collection_data = collectionData<any>(dataRef, { idField: 'id' })
    return collection_data;
  }

  docDataQuery(path: any, id?: any, queryFn?: any) {
    let dataRef: any = this.docRef(path);
    if (queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q
    }
    let doc_data;
    if (id) doc_data = docData<any>(dataRef, { idField: 'id' });
    else doc_data = docData<any>(dataRef);
    return doc_data
  } wherQuery(fieldPath: any, condition: any, value: any) {
    return where(fieldPath, condition, value)
  }
  orderByQuery(fieldPath, directionStr: OrderByDirection = 'asc') {
    return orderBy(fieldPath, directionStr)
  }
  async deleteDocument(path: string): Promise<void> {
    await deleteDoc(doc(this.firestore, path));
  }
}
