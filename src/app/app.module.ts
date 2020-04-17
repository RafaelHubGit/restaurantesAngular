import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { SigninComponent } from './components/signin/signin.component';
import { LogsigninComponent } from './pages/logsignin/logsignin.component';
import { HomeComponent } from './pages/home/home.component';
import { APP_ROUTING } from './app.routes';

/* import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login'; */


import {MatMenuModule} from '@angular/material/menu';

/* const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('1039370416448421')
  }
]);
export function provideConfig() {
  return config;
} */

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SigninComponent,
    LogsigninComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMenuModule,
    AngularFireModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    /* SocialLoginModule, */
    APP_ROUTING
  ],
  providers: [
    /* {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    } */
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
