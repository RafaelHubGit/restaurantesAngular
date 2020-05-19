import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ItemMenuModel } from '../models/itemMenu.model';
import { HerramientasService } from './herramientas.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  idRestaurante: string;

  constructor( private firestore: AngularFirestore, 
               private tls: HerramientasService) {

    this.idRestaurante = this.tls.idRestaurante;

  }

  getMenu(){

    const query = this.tls.restFire
                      .collection('menuRest')
                      .ref
                      .orderBy('nombre');
    return this.firestore.collection('restaurantes', ref => query).get();

  }

  addItemMenu( item: ItemMenuModel ){

    const itemMenu = {
      ...item,
      idRestaurante : this.idRestaurante
    }
    return this.tls.restFire
                .collection('menuRest')
                .add( itemMenu );
  }

  updateItemMenu( itemMenu: ItemMenuModel ){

    return this.tls.restFire
                .collection('menuRest')
                .doc( itemMenu.idMenu )
                .update( itemMenu );
  }

  deleteItemMenu( itemMenu: ItemMenuModel ){

    return this.tls.restFire
                .collection('menuRest')
                .doc( itemMenu.idMenu )
                .delete();
  }


}
