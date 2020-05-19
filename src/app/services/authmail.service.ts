 import { Injectable } from '@angular/core';

 import { AngularFireAuth } from '@angular/fire/auth';
 import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
 import * as firebase from 'firebase';
 
 //Models
 import { usuarioSesion } from '../classes/usuarioSesion.class';
 import { Restaurante } from '../classes/restaurante.class';
 import { UsuarioModel } from '../models/usuario.model';
 
 import Swal from 'sweetalert2';
import { HerramientasService } from './herramientas.service';

 @Injectable({
  providedIn: 'root'
 })
export class AuthmailService {

  idRestautante: string;
  userToken: string;
  usuarioSesion: usuarioSesion;
  linkPrimario = 'http://primario.com.mx';


  constructor(private angFAuth: AngularFireAuth,
              private firestore: AngularFirestore) { 

    this.leerToken();

  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
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

  }

  authGoogle(){

  }

  guardarUsuarioStorage( usuario: usuarioSesion){
    
    localStorage.setItem('usuario', JSON.stringify(usuario));

  }

  leerUsuarioSesionStorage(){

    if ( localStorage.getItem('usuario') ){
      this.usuarioSesion = JSON.parse(localStorage.getItem('usuario'));
    }

    return this.usuarioSesion;

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


  //Se crea el restaurante y se agregan los datos del mismo por primera vez
  creaRestaurante( restaurante: Restaurante, usuario: usuarioSesion ){

    const rest = {
      ...restaurante
    };

    const usuarioV = {
      ...usuario
    };

    this.firestore.collection('restaurantes').add( rest )
          .then( resp => {
            this.idRestautante = resp.id;

            this.crearUsuario( usuarioV, resp.id );
          }).catch( err => {
            
            Swal.fire({
              icon: 'error',
              title: 'Error Res-01',
              text: `Error al realizar la operación favor de intenrarlo nuevaente!
                     Si el error persiste favor de contactar al equipo de Primario`,
              footer: `<a href="${ this.linkPrimario }"> Equipo Primario : ${this.linkPrimario} </a>`
            });

          });
  }

  crearUsuario( usuario: usuarioSesion, idRestaurante ){

    const usuarioC = {
      ...usuario,
      idRestaurante: idRestaurante,
      fechaRegistro: new Date(),
      email: this.usuarioSesion.email,
      usuario: this.usuarioSesion.usuario,
      primeraVez: false
    };

    this.usuarioSesion = usuarioC;

    this.guardarUsuarioStorage( usuarioC );

    this.firestore.collection('usuarios').doc(`${ usuarioC.email }`)
                  .set( usuarioC )
                  .catch( err => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error Us-01 ',
                      text: `Error al realizar la operación favor de intenrarlo nuevaente! 
                              <br> Si el error persiste favor de contactar al equipo de Primario`,
                      footer: `<a href="${ this.linkPrimario }"> Equipo Primario : ${this.linkPrimario} </a>`
                    });
                  });
  }


  getUsuario( usuario: string){
    const query = this.firestore.collection('usuarios').ref.where('usuario', '==', `${ usuario }`);
    return this.firestore.collection('usuarios', ref => query).get();
  }

}
