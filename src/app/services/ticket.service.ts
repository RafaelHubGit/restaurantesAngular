import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { TicketDatosModel } from '../models/ticketDatos.model';
import { ItemMeseroModel } from '../models/itemMesero.model';

import { HerramientasService } from './herramientas.service';
import { TicketProductoDetalleModel, TicketProductoModel, ProdToAreaModel } from '../models/ticketProducto.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  idRestaurante: string;
  meserosArr: ItemMeseroModel[] = [];

  constructor( private firestore: AngularFirestore,
               private tls: HerramientasService ) {

    this.idRestaurante = this.tls.getIdRestaurante();

  }

  getMenu(){

    const query = this.tls.restFire
                      .collection('menu')
                      .ref
                      .orderBy('nombre');
    return this.firestore.collection('restaurantes', ref => query).get();

  }

  getMesas(){

    const query = this.tls.restFire
                      .collection('mesas')
                      .ref
                      .orderBy('mesa');
    return this.firestore.collection('restaurantes', ref => query).get();

  }

  getMeseros() {

    const query = this.tls.restFire
                      .collection('meseros')
                      .ref
                      .orderBy('nombre');
    return this.firestore.collection('restaurantes', ref => query).get();

  }

  getTickets(){

    const query = this.tls.restFire
                      .collection('ticket')
                      .ref
                      .orderBy('noOrden');
    return this.firestore.collection('restaurantes', ref => query).snapshotChanges();


  }

  getNoOrden(){

    const fecha = new Date();
    const dia = this.tls.getDay(fecha);
    const mes = this.tls.getMonth(fecha);
    const anio = this.tls.getYear(fecha);

    const query = this.tls.restFire
                      .collection('ticket')
                      .ref
                      .where( 'dia', '==', dia)
                      .where('mes', '==', mes)
                      .where('anio', '==', anio)
                      .orderBy('noOrden', 'desc')
                      .limit(1);

    return this.firestore.collection('restaurantes', ref => query)
                .get();
  }

  addTicket( item: TicketDatosModel ){

    const ticket = {
      ...item,
      idRestaurante : this.idRestaurante
    };
    return this.tls.restFire
                .collection('ticket')
                .add( ticket );
  }

  addTicketProds( item: TicketProductoDetalleModel ){

    const ticketProd = {
      ...item
    };

    return this.firestore.collection('restaurantes').doc(`${this.idRestaurante}`)
                .collection('ticket')
                .doc( item.idTicket )
                .collection('ticketProds')
                .add( ticketProd );
  }

  /* Agrega los productos a una coleccion al mismo nivel que el ticket, para que se envie a las areas */
  addProdsToArea( item: ProdToAreaModel ){

    const prod = {
      ...item
    };

    return this.firestore.collection('restaurantes').doc(`${this.idRestaurante}`)
                .collection('prodsToArea')
                .add( prod );
  }

}
