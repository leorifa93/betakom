import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  where,
  collection,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  orderBy,
  onSnapshot,
  or,
  startAfter,
  limit,
} from "firebase/firestore";
import {Injectable} from "@angular/core";
import {Firestore} from "@angular/fire/firestore";
import firebase from "firebase/compat";
import WhereFilterOp = firebase.firestore.WhereFilterOp;

@Injectable({
  providedIn: 'root'
})
export abstract class CollectionService {

  protected collectionName: string = '';
  protected db: Firestore

  constructor() {
    this.db = getFirestore()
  }

  public add(document: any, collectionName?: string, subCollection?: string[]) {
    subCollection = subCollection ? subCollection : [];
    return addDoc(collection(this.db, collectionName ? collectionName : this.collectionName, ...subCollection), document);
  }
  public set(id: string, document: any, collectionName?: string, subCollection?: any[]) {
    subCollection = subCollection ? subCollection : [];
    return setDoc(doc(this.db, collectionName ? collectionName : this.collectionName, id, ...subCollection), document);
  }

  public get(id: string): Promise<any> {
    return getDoc(doc(this.db, this.collectionName, id)).then((snapshot) => {
      const data = <any>snapshot.data();

      if (data) {
        data.id = snapshot.id;
      }

      return (data);
    })
  }

  public remove(id: string, collectionName?: string, subCollection?: any[]) {
    subCollection = subCollection ? subCollection : [];
    return deleteDoc(doc(this.db, collectionName ? collectionName : this.collectionName, id, ...subCollection));
  }

  public createId(collectionName?: string, subCollection?: any[]) {
    subCollection = subCollection ? subCollection : [];
    return doc(collection(this.db, collectionName ? collectionName : this.collectionName, ...subCollection)).id;
  }

  public getAll(limitOffset:number = 10, offset?: string, filters?: {key: string, opr: WhereFilterOp, value: any}[], order?: any, collectionName?: string,
                isOnSnapshot?: boolean, callback?: (snapshot) => void, subCollection?: any[], isOrFilter?:boolean): any{
    subCollection = subCollection ? subCollection : [];
    const ref = collection(this.db, collectionName ? collectionName : this.collectionName, ...subCollection);
    let q;
    let queryFilters = [];

    if (filters) {

      for (let filter of filters) {
        queryFilters.push(where(filter.key, filter.opr, filter.value))
      }

    }

    if (order) {
      if (typeof(order) === 'object') {
        for (let o of order) {
          queryFilters.push(orderBy(o.key, o.descending));
        }
      } else {
        queryFilters.push(orderBy(order, 'desc'));
      }
    }

    if (offset) {
      queryFilters.push(startAfter(offset));
    }

    if (limitOffset) {
      queryFilters.push(limit(limitOffset))
    }

    if (!isOrFilter) {
      q = query(ref, ...queryFilters);
    } else {
      q = query(ref, or(...queryFilters));
    }

    if (isOnSnapshot) {
      return onSnapshot(q, (snapshot) => {
        callback(snapshot);
      });
    } else {
      return getDocs(q).then((snapshot) => {
        let docs: any[] = [];

        snapshot.docChanges().forEach((doc) => {
          let docData = (<any>doc.doc.data());
          docData.id = doc.doc.id;

          docs.push(docData);
        });

        return docs;
      });
    }
  }

  static getSnapshotDataFromCollection(
    data: any[],
    snapshot: any,
    idProperty: string = 'id',
    callback?: { added: (doc) => void, change?: (doc) => void },
    preCallback?: { added: (doc) => void },
    sort: 'asc' | 'desc' = 'asc',
    notChange?: boolean
  ) {
    snapshot.docChanges().forEach((change, index) => {
      let docData = change.doc.data();

      if (!docData.id) {
        docData.id = change.doc.id;
      }

      if (change.type === 'added') {
        if (preCallback) {
          preCallback.added({docData: docData, doc: change.doc, index: index});
        }

        if (sort === 'asc') {
          data.push(docData);
        } else {
          data.unshift(docData);
        }

        if (callback) {
          callback.added({docData: docData, doc: change.doc, index: index});
        }
      } else if (change.type === 'modified') {
        if (!notChange) {
          if (data.length >= 1) {
            data = data.map((current) => {
              if (current[idProperty] === docData[idProperty]) {
                current = docData;
              }

              if (callback && callback.change) {
                callback.change({docData: docData, doc: change.doc});
              }

              return current;
            });
          } else {
            data.push(docData);
          }
        }
      } else {
        data = data.filter((current) => {
          return current[idProperty] !== docData[idProperty];
        });
      }
    });

    return data;
  }

  public observer(id: string, callback: (snapshot) => void,  subCollection?: string[]) {
    subCollection = subCollection ? subCollection : [];
    return onSnapshot(doc(this.db, this.collectionName, id, ...subCollection), (doc) => {
      callback(doc);
    });
  }
}
