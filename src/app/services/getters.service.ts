//NOTA!!!
//Este service sirve para traer la informacion a nivel global en los snapshots 
// con el fin de tener centralizada la informacion y no estar llamando a cada rato la info

import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { HerramientasService } from './herramientas.service';

import { ItemMenuModel } from '../models/itemMenu.model';
import { ItemMeseroModel } from '../models/itemMesero.model';
import { MesaModel } from '../models/mesa.model';
import { CategoriaModel } from '../models/categoria.model';
import { MenuModel } from '../models/menu.model';
import { map } from 'rxjs/operators';
import { AreaModel } from '../models/area.model';

@Injectable({
  providedIn: 'root'
})
export class GettersService {

  idRestaurante: string;

  areaArrGet: AreaModel[] = [];
  meserosArrGet: ItemMeseroModel[] = [];
  mesasArrGet: MesaModel[] = [];
  menuArrGet: ItemMenuModel[] = [];
  categoriaArrGet: CategoriaModel[] = [];

  dataTipo: any;

  constructor( private firestore: AngularFirestore,
               private tls: HerramientasService) {

    this.idRestaurante = this.tls.getIdRestaurante();

    this.getMeseros();
    this.getMesas();
    this.getMenu();
    this.getCategoria();
    this.getArea();
    this.dataTipo = this.dataTipoFnc();

  }



  //Regresa los Meseros automaticamente con snapshot, si hay algun cambio en la informacion, la traera automaticamente 
  getMeseros(){

    const meserosArr = [];

    const query = this.tls.restFire
                      .collection('meseros')
                      .ref
                      .orderBy('nombre');
    this.firestore.collection('restaurantes', ref => query)
              .snapshotChanges()
              .subscribe( resp => {

                let meseros: any;

                resp.forEach( doc => {
                  meseros = doc.payload.doc.data();

                  const MESEROTEMP = {
                    ...meseros,
                    id: doc.payload.doc.id
                  }

                  meserosArr.push( MESEROTEMP );

                });

              });
    this.meserosArrGet = meserosArr;
  }

  //Regresa el arreglo Modelo de los Meseros 
  getMeserosModel( meserosArr: [] ){

    const MESEROSARR = this.meserosArrGet;
    const returnMeseros: ItemMeseroModel[] = [];

    if ( meserosArr.length === 0 ){
      return returnMeseros;
    }

    meserosArr.forEach( element => {

      const result = MESEROSARR.find( ({ id }) => id === element );
      delete result.idRestaurante;
      returnMeseros.push( result );

    });
    return returnMeseros;

  }



  getMesas(){

    const itemArr = [];

    const query = this.tls.restFire
                      .collection('mesas')
                      .ref
                      .orderBy('mesa');
    this.firestore.collection('restaurantes', ref => query)
              .snapshotChanges()
              .subscribe( resp => {

                let tempItem: any;

                resp.forEach( doc => {
                  tempItem = doc.payload.doc.data();

                  const ITEMTEMP = {
                    ...tempItem,
                    id: doc.payload.doc.id
                  }

                  itemArr.push( ITEMTEMP );

                });

              });
    this.mesasArrGet = itemArr;
  }

  getMesasModel( mesasArr: [] ){

    const ITEMARR = this.mesasArrGet;
    const returnArr: MesaModel[] = [];

    if ( mesasArr.length === 0 ){
      return returnArr;
    }

    mesasArr.forEach( element => {

      const result = ITEMARR.find( ({ id }) => id === element );
      delete result.idRestaurante;
      returnArr.push( result );

    });
    return returnArr;

  }

  getMenu(){

    const itemArr = [];

    const query = this.tls.restFire
                      .collection('menuRest')
                      .ref
                      .orderBy('nombre');
    this.firestore.collection('restaurantes', ref => query)
              .snapshotChanges()
              .subscribe( resp => {

                let tempItem: any;

                resp.forEach( doc => {
                  tempItem = doc.payload.doc.data();

                  const ITEMTEMP = {
                    ...tempItem,
                    id: doc.payload.doc.id
                  }

                  itemArr.push( ITEMTEMP );

                });

              });
    this.menuArrGet = itemArr;
  }

  getMenuModel( menuArr: [] ){

    const ITEMARR = this.menuArrGet;
    const returnArr: ItemMenuModel[] = [];

    if ( menuArr.length === 0 ){
      return returnArr;
    }

    menuArr.forEach( element => {

      const result = ITEMARR.find( ({ idMenu }) => idMenu === element );
      delete result.idRestaurante;
      returnArr.push( result );

    });
    return returnArr;

  }

  getCategoria(){

    const itemArr = [];

    const query = this.tls.restFire
                      .collection('categorias')
                      .ref
                      .orderBy('categoria');
    this.firestore.collection('restaurantes', ref => query)
              .snapshotChanges()
              .subscribe( resp => {

                let tempItem: any;

                resp.forEach( doc => {
                  tempItem = doc.payload.doc.data();

                  const ITEMTEMP = {
                    ...tempItem,
                    id: doc.payload.doc.id
                  }

                  itemArr.push( ITEMTEMP );

                });

              });
    this.categoriaArrGet = itemArr;
  }

  getCategoriaModel( categoriaArr: [] ){

    const ITEMARR = this.categoriaArrGet;
    const returnArr: CategoriaModel[] = [];

    if ( categoriaArr.length === 0 ){
      return returnArr;
    }

    categoriaArr.forEach( element => {

      const result = ITEMARR.find( ({ id }) => id === element );
      delete result.idRestaurante;
      returnArr.push( result );

    });
    return returnArr;
  }


  getArea(){

    const itemArr = [];

    const query = this.tls.restFire
                      .collection('areas')
                      .ref
                      .orderBy('nombre');
    this.firestore.collection('restaurantes', ref => query)
              .snapshotChanges()
              .subscribe( resp => {

                let tempItem: any;

                resp.forEach( doc => {
                  tempItem = doc.payload.doc.data();

                  const ITEMTEMP = {
                    ...tempItem,
                    id: doc.payload.doc.id
                  }

                  itemArr.push( ITEMTEMP );

                });

              });
    this.areaArrGet = itemArr;
  }

  getAreaModel( areaArr: [] ){

    const ITEMARR = this.areaArrGet;
    const returnArr: AreaModel[] = [];

    if ( areaArr.length === 0 ){
      return returnArr;
    }

    areaArr.forEach( element => {

      const result = ITEMARR.find( ({ id }) => id === element );
      delete result.idRestaurante;
      returnArr.push( result );

    });
    return returnArr;
  }

  dataTipoFnc(){

    const dataTipo = {
      tipo: [
        { value: 'entraSale',
          option: 'Entra / Sale'},
        { value: 'tiempo1',
          option: 'Tiempo 1'},
        { value: 'tiempo2',
          option: 'Tiempo 2'},
        { value: 'postre',
          option: 'Postre'}
      ]
    };

    return dataTipo;

  }


}
