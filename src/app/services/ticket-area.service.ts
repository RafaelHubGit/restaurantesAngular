import { Injectable } from '@angular/core';
import { HerramientasService } from './herramientas.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TicketAreaService {

  idRestaurante: string;

  constructor( private tls: HerramientasService,
               private firestore: AngularFirestore ) { 

                this.idRestaurante = this.tls.idRestaurante;

               }



  getProdArea( idArea: string ){

    const query = this.firestore.collection('restaurantes').doc(`${this.idRestaurante}`)
                      .collection('prodsToArea')
                      .ref
                      .where('areas', 'array-contains', idArea )
                      .where('status', '==', 'ordenado')
                      .orderBy('fecha', 'desc');

    return this.firestore.collection('restaurantes', ref => query)
                      .snapshotChanges();

  }

}
