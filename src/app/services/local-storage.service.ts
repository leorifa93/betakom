import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private _storage: Storage;
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }
  public setUser(user: any) {
    return this._storage.set('user', user);
  }

  public getUser() {
    return this._storage.get('user');
  }

  public setSettings(settings) {
    return this._storage.set('settings', settings);
  }

  public getSettings() {
    return this._storage.get('settings');
  }

  public getFilter() {
    return this._storage.get('filter');
  }

  public setFilter(filter) {
    return this._storage.set('filter', filter);
  }

  public setLang(lang) {
    return this._storage.set('lang', lang);
  }

  public getLang() {
    return this._storage.get('lang');
  }

  public setDeviceId(deviceId: string) {
    return this._storage.set('deviceId', deviceId);
  }

  public getDeviceId() {
    return this._storage.get('deviceId');
  }

  public getDiscoverInfo() {
    return this._storage.get('discoverInfo');
  }

  public setDiscoverInfo(info: boolean = true) {
    return this._storage.set('discoverInfo', info);
  }
}
