import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { HerramientasService } from './herramientas.service';
import { CategoriaModel } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  idRestaurante: string;

  constructor( private firestore: AngularFirestore,
               private tls: HerramientasService) {

    this.idRestaurante = this.tls.getIdRestaurante();

  }

  getcategorias(){

    const query = this.tls.restFire
                      .collection('categorias')
                      .ref
                      .orderBy('categoria');
    return this.firestore.collection('restaurantes', ref => query).get();

  }

  addcategoria( categoria: CategoriaModel ){

    const CATEGORIA = {
      ...categoria,
      idRestaurante: this.idRestaurante
    }
    return this.tls.restFire
                .collection('categorias')
                .add( CATEGORIA );
  }

  updatecategoria( categoria: CategoriaModel ){

    const id = categoria.id;
    delete categoria.id;

    return this.tls.restFire
                .collection('categorias')
                .doc( id )
                .update( categoria );
  }

  deletecategorias( categoria: CategoriaModel ){

    return this.tls.restFire
                .collection('categorias')
                .doc( categoria.id )
                .delete();
  }

}
