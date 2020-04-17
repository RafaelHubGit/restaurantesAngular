import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthmailService } from '../services/authmail.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private auth: AuthmailService,
                private router: Router ){}

  canActivate(): boolean {
    
    if ( this.auth.estaAutenticado() ){
      return true;
    }else{
      this.router.navigateByUrl('/login');
    }

  }
  
}
