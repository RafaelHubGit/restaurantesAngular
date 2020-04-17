 import { Injectable } from '@angular/core';
 import { map } from 'rxjs/operators';
 import { HttpClient } from '@angular/common/http';
 import { UsuarioModel } from '../models/usuario.model';
 /* import { AuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login'; */

 import Swal from 'sweetalert2';


 import { AngularFireAuth } from '@angular/fire/auth';
 import { auth } from 'firebase/app';

 @Injectable({
  providedIn: 'root'
 })
export class AuthmailService {

  userToken: string;

  constructor( private http: HttpClient,
              private angFAuth: AngularFireAuth) { 

    this.leerToken();

  }


  logout(){
    localStorage.removeItem('token');
    return this.angFAuth.signOut();
  }; 

  login( usuario: UsuarioModel ){

    return this.angFAuth.signInWithEmailAndPassword( usuario.email, usuario.pass );

  };

  nuevoUsuario( usuario: UsuarioModel ){
    return this.angFAuth.createUserWithEmailAndPassword( usuario.email, usuario.pass);
  };

  authFacebook(){

    console.log("Facebook");

  };

  authGoogle(){

  }

 

  guardarToken( idToken: string){

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date ();
    hoy.setSeconds( 3600 );
    localStorage.setItem('expira', hoy.getTime().toString() );

  }

  private leerToken(){

    if( localStorage.getItem('token') ){
       this.userToken = localStorage.getItem('token');
    }else{
      this.userToken = '';
    }

    return this.userToken;

  }

  estaAutenticado(): boolean{

    if ( this.userToken.length === 0 ){
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ){
      return true;
    }else{
      return false;
    }

  }

}
