import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {initializeAuth, indexedDBLocalPersistence, getAuth, connectAuthEmulator} from "firebase/auth";
import {initializeApp} from "firebase/app";
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule, TranslateService, TranslateStore} from "@ngx-translate/core";
import {getFirestore, connectFirestoreEmulator} from "firebase/firestore";
import {connectStorageEmulator, getStorage} from "firebase/storage";
import {environment} from "../environments/environment";
import {Capacitor} from "@capacitor/core";

const app = initializeApp(environment.firebaseConfig);

if (Capacitor.isNativePlatform()) {
  initializeAuth(app, {
    persistence: indexedDBLocalPersistence,
  });
}

if (!environment.production) {
  const db = getFirestore();
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectAuthEmulator(getAuth(), 'http://127.0.0.1:9099');
  connectStorageEmulator(getStorage(), '127.0.0.1', 9199);
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, TranslateModule.forChild({
    loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
    },
    defaultLanguage: 'de'
  }), HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, TranslateService, TranslateStore],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
