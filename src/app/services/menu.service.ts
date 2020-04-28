import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ItemMenuModel } from '../models/itemMenu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  idRestaurante: string;

  constructor( private firestore: AngularFirestore) {

    this.idRestaurante = this.getIdRestaurante();

  }

  getMenu(){

    const query = this.firestore.collection('restaurantes')
                                .doc(`${this.idRestaurante}`)
                                .collection('menu')
                                .ref
                                .orderBy('nombre');
    return this.firestore.collection('restaurantes', ref => query).get();

  }

  addItemMenu( item: ItemMenuModel ){

    const itemMenu = {
      ...item,
      'idRestaurante' : this.idRestaurante
    }
    return this.firestore.collection('restaurantes')
                  .doc(`${this.idRestaurante}`)
                  .collection('menu')
                  .add( itemMenu );
  }

  updateItemMenu( itemMenu: ItemMenuModel ){

    return this.firestore.collection('restaurantes')
                          .doc(`${this.idRestaurante}`)
                          .collection('menu')
                          .doc( itemMenu.idMenu )
                          .update( itemMenu );
  }

  deleteItemMenu( itemMenu: ItemMenuModel ){

    return this.firestore.collection('restaurantes')
                          .doc(`${this.idRestaurante}`)
                          .collection('menu')
                          .doc( itemMenu.idMenu )
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
