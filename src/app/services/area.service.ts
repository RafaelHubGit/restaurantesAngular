import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AreaModel } from '../models/area.model';
import { HerramientasService } from './herramientas.service';
import { MenuModel } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  idRestaurante: string;

  constructor( private firestore: AngularFirestore,
               private tls: HerramientasService ) { 

    this.idRestaurante = this.tls.getIdRestaurante();

  }

  getAreas(){

    const query = this.tls.restFire
                      .collection('areas')
                      .ref
                      .orderBy('nombre');
    return this.firestore.collection('restaurantes', ref => query).get();

  }

  addArea( area: AreaModel ){

    const AREA = {
      ...area,
      idRestaurante: this.idRestaurante
    }
    return this.tls.restFire
                .collection('areas')
                .add( AREA );
  }

  updateArea( area: AreaModel ){

    const id = area.id;
    delete area.id;

    return this.tls.restFire
                .collection('areas')
                .doc( id )
                .update( area );
  }

  deleteAreas( Area: AreaModel ){

    return this.tls.restFire
                .collection('Areas')
                .doc( Area.id )
                .delete();
  }

  addMenu( area: AreaModel, idArea ){

    const MENU: MenuModel = {
      id: '',
      nombre: area.nombre,
      redirectTo: `area/${ idArea }`,
      tipo: 'operacion'
    };
    delete MENU.id;

    return this.tls.restFire
                .collection('menu')
                .add( MENU );

  }

}
