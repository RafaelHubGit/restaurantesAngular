import { Injectable } from '@angular/core';
import { HerramientasService } from './herramientas.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NavBarService {

  constructor( private tls: HerramientasService,
               private firestore: AngularFirestore ) { }

  getMenu(){

    const query = this.firestore.collection('menu').ref.orderBy('nombre');
    return this.firestore.collection('menu', ref => query).get();

  }

  getMenuFromArea(){

    const query = this.firestore.collection('restaurantes')
                                .doc(`${ this.tls.idRestaurante }`)
                                .collection('menu')
                                .ref.orderBy('nombre');
    return this.firestore.collection('menu', ref => query).snapshotChanges();

  }

}
