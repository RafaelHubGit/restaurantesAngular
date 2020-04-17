 import { Injectable } from '@angular/core';
 import { map } from 'rxjs/operators';
 import { HttpClient } from '@angular/common/http';
 import { UsuarioModel } from '../models/usuario.model';

 @Injectable({
  providedIn: 'root'
 })
export class AuthmailService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apikey = 'AIzaSyAROgBxoKDB3bue_deiFUPqBRmq64ClBZM';

  userToken: string;

  constructor( private http: HttpClient ) { 

    this.leerToken();

  }


  logout(){
    localStorage.removeItem('token');
  }; 

  login( usuario: UsuarioModel ){

    const authData = {
      email: usuario.email,
      password: usuario.pass,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }signInWithPassword?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp => {
        this.guardarToken( resp['idToken'] );
        return resp;
      })
    );

  };

  nuevoUsuario( usuario: UsuarioModel ){

    const authData = {
      email: usuario.email,
      password: usuario.pass,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }signUp?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp => {
        this.guardarToken( resp['idToken'] );
        return resp;
      })
    );

  };

 

  private guardarToken( idToken: string){

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

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

    return this.userToken.length > 2;

  }

}
