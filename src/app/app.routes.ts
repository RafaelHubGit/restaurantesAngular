import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LogsigninComponent } from './pages/logsignin/logsignin.component';
import { AuthGuard } from './guards/auth.guard';


const APP_ROUTES: Routes = [
    { path: 'login', component: LogsigninComponent },
    { path: 'home', component: HomeComponent, canActivate:[ AuthGuard ] },
    { path: '**', pathMatch: 'full', redirectTo: 'login' }

]

export const APP_ROUTING = RouterModule.forRoot( APP_ROUTES );
