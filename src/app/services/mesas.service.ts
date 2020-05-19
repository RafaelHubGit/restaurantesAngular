import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MesaModel } from '../models/mesa.model';
import { HerramientasService } from './herramientas.service';

@Injectable({
  providedIn: 'root'
})
export class MesasService {

  idRestaurante: string;

  algo: any;


  constructor( private firestore: AngularFirestore,
               private tls: HerramientasService ) {

    this.idRestaurante = this.tls.getIdRestaurante();

  }



  getMesas(){

    const query = this.tls.restFire
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
    return this.tls.restFire
                .collection('mesas')
                .add( MESA );
  }

  updateMesero( mesa: MesaModel ){

    return this.tls.restFire
                .collection('mesas')
                .doc( mesa.id )
                .update( mesa );
  }

  deleteMesas( mesa: MesaModel ){

    return this.tls.restFire
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
