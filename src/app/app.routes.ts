import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LogsigninComponent } from './pages/logsignin/logsignin.component';
import { AuthGuard } from './guards/auth.guard';

//Importa las rutas hijas 
import { HOME_ROUTES } from './pages/home/home.routes';


const APP_ROUTES: Routes = [
    { path: 'login', component: LogsigninComponent },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [ AuthGuard ],
        children: HOME_ROUTES
    },
    { path: '**', pathMatch: 'full', redirectTo: 'login' }

]

export const APP_ROUTING = RouterModule.forRoot( APP_ROUTES );
