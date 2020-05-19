import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class HerramientasService {

  idRestaurante: string;
  linkPrimario = 'http://primario.com.mx';
  restFire: any;

  constructor( private firestore: AngularFirestore ) { 

    this.idRestaurante = this.getIdRestaurante();
    this.restFire = this.firestore.collection('restaurantes').doc(`${this.idRestaurante}`);

  }


  getIdRestaurante(){

    let usuario: any;

    if ( localStorage.getItem('usuario') ){
      usuario = JSON.parse(localStorage.getItem('usuario'));
      return usuario.idRestaurante;
     }else{
      return '';
     }

  }


  getDay( fecha: Date ){

    return fecha.getDate();

  }

  getMonth( fecha: Date ){

    return fecha.getMonth() + 1;

  }

  getYear( fecha: Date ){

    return fecha.getFullYear();

  }

  getHours( fecha: Date ){

    return fecha.getHours();

  }

  getMinutes( fecha: Date ){

    return fecha.getMinutes();

  }


  /* Recibe el arreglo de objetos y devuelve un arreglo con los id`s */
  /* ya que para que en el formulario no se puede enviar el objeto */
  getIdFromArr( array: []){

    if ( array.length === 0 ){
      return;
    }

    const arrTemp = [];
    array.forEach(item => {
      arrTemp.push( item['id'] );
    });

    return arrTemp;
  }


}
