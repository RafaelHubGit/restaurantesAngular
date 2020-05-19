import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ItemMeseroModel } from '../models/itemMesero.model';

import { HerramientasService } from './herramientas.service';

@Injectable({
  providedIn: 'root'
})
export class MeserosService {

  idRestaurante: string;

  constructor( private firestore: AngularFirestore,
               private tls: HerramientasService ) { 

    this.idRestaurante = this.getIdRestaurante();

  }


  getMeseros(){

    const query = this.tls.restFire
                      .collection('meseros')
                      .ref
                      .orderBy('nombre');
    return this.firestore.collection('restaurantes', ref => query).get();

  }

  addMesero( mesero: ItemMeseroModel ){

    const MESERO = {
      ...mesero,
      idRestaurante : this.idRestaurante
    };

    return this.tls.restFire
                .collection('meseros')
                .add( MESERO );
  }

  updateMesero( mesero: ItemMeseroModel ){

    return this.tls.restFire
                .collection('meseros')
                .doc( mesero.id )
                .update( mesero );
  }

  deleteMesero( mesero: ItemMeseroModel ){

    return this.tls.restFire
                .collection('meseros')
                .doc( mesero.id )
                .delete();
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


}
