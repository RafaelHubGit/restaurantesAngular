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

import {MatMenuModule} from '@angular/material/menu';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirsttimeComponent } from './dialogs/firsttime/firsttime.component';
import { MenuComponent } from './components/menu/menu.component';
import { ItemMenuComponent } from './dialogs/item-menu/item-menu.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { MeserosComponent } from './components/meseros/meseros.component';
import { MeserosDialogComponent } from './dialogs/meseros-dialog/meseros-dialog.component';
import { MesasDialogsComponent } from './dialogs/mesas-dialogs/mesas-dialogs.component';
import { MesasComponent } from './components/mesas/mesas.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { AreasComponent } from './components/areas/areas.component';
import { AreasDialogComponent } from './dialogs/areas-dialog/areas-dialog.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { CategoriasDialogComponent } from './dialogs/categorias-dialog/categorias-dialog.component';
import { TicketAreaComponent } from './components/ticket-area/ticket-area.component';
import { TableTicketAreaComponent } from './shared/table-ticket-area/table-ticket-area.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SigninComponent,
    LogsigninComponent,
    HomeComponent,
    FirsttimeComponent,
    MenuComponent,
    ItemMenuComponent,
    BienvenidaComponent,
    TicketComponent,
    MeserosComponent,
    MeserosDialogComponent,
    MesasDialogsComponent,
    MesasComponent,
    TicketsComponent,
    AreasComponent,
    AreasDialogComponent,
    CategoriasComponent,
    CategoriasDialogComponent,
    TicketAreaComponent,
    TableTicketAreaComponent
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
    APP_ROUTING,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
