import { RouterModule, Routes } from '@angular/router';


const APP_ROUTES: Routes = [
    /* { path: 'login', component: LogsigninComponent },
    { path: 'home', component: HomeComponent }, */
    { path: '**', pathMatch: 'full', redirectTo: 'login' }

]

export const APP_ROUTING = RouterModule.forRoot( APP_ROUTES );
