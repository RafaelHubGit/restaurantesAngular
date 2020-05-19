import { Routes } from '@angular/router';


import { MenuComponent } from '../../components/menu/menu.component';
import { BienvenidaComponent } from '../../components/bienvenida/bienvenida.component';
import { TicketsComponent } from '../../components/tickets/tickets.component';
import { TicketComponent } from '../../components/ticket/ticket.component';
import { MeserosComponent } from '../../components/meseros/meseros.component';
import { MesasComponent } from 'src/app/components/mesas/mesas.component';
import { AreasComponent } from '../../components/areas/areas.component';
import { CategoriasComponent } from '../../components/categorias/categorias.component';
import { TicketAreaComponent } from '../../components/ticket-area/ticket-area.component';

export const HOME_ROUTES: Routes = [
    { path: 'menu', component: MenuComponent },
    { path: 'bienvenida', component: BienvenidaComponent },
    { path: 'ticket/:id', component: TicketComponent },
    { path: 'tickets', component: TicketsComponent },
    { path: 'area/:idArea', component: TicketAreaComponent },
    { path: 'meseros', component: MeserosComponent },
    { path: 'mesas', component: MesasComponent },
    { path: 'areas', component: AreasComponent },
    { path: 'categorias', component: CategoriasComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'bienvenida' }

];
