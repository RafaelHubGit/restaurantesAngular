import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MesaModel } from '../models/mesa.model';

@Injectable({
  providedIn: 'root'
})
export class MesasService {

  idRestaurante: string;


  constructor( private firestore: AngularFirestore ) { 

    this.idRestaurante = this.getIdRestaurante();

  }



  getMesas(){

    const query = this.firestore.collection('restaurantes')
                                .doc(`${this.idRestaurante}`)
                                .collection('mesas')
                                .ref
                                .orderBy('mesa');
    return this.firestore.collection('restaurantes', ref => query).get();

  }

  addMesa( mesa: MesaModel ){

    const MESA = {
      ...mesa,
      'idRestaurante': this.idRestaurante
    }
    return this.firestore.collection('restaurantes')
                  .doc(`${this.idRestaurante}`)
                  .collection('mesas')
                  .add( MESA );
  }

  updateMesero( mesa: MesaModel ){

    return this.firestore.collection('restaurantes')
                          .doc(`${this.idRestaurante}`)
                          .collection('mesas')
                          .doc( mesa.id )
                          .update( mesa );
  }

  deleteMesas( mesa: MesaModel ){

    return this.firestore.collection('restaurantes')
                          .doc(`${this.idRestaurante}`)
                          .collection('mesas')
                          .doc( mesa.id )
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
