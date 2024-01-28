import {Injectable} from '@angular/core';
import {CollectionService} from "../collection.service";
import {onSnapshot, doc, or} from "firebase/firestore";


@Injectable({
  providedIn: 'root'
})
export class UserCollectionService extends CollectionService {

  observe: any;
  constructor() {
    super();

    this.collectionName = 'Users';
  }

  startObserver(userId: string, callback: (user: any) => void) {
    this.observe = onSnapshot(doc(this.db, this.collectionName, userId), (doc) => {
      callback(doc.data());
    });
  }
}
