import { Routes } from '@angular/router';


import { MenuComponent } from '../../components/menu/menu.component';
import { BienvenidaComponent } from '../../components/bienvenida/bienvenida.component';
import { TicketComponent } from '../../components/ticket/ticket.component';
import { MeserosComponent } from '../../components/meseros/meseros.component';
import { MesasComponent } from 'src/app/components/mesas/mesas.component';



export const HOME_ROUTES: Routes = [
    { path: 'menu', component: MenuComponent },
    { path: 'bienvenida', component: BienvenidaComponent },
    { path: 'ticket', component: TicketComponent },
    { path: 'meseros', component: MeserosComponent },
    { path: 'mesas', component: MesasComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'bienvenida' }

];
