import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { CategoriaService } from '../../services/categoria.service';
import { HerramientasService } from '../../services/herramientas.service';

import { CategoriaModel } from '../../models/categoria.model';
import { CategoriasDialogComponent } from '../../dialogs/categorias-dialog/categorias-dialog.component';

import Swal from 'sweetalert2';
declare var $:any;

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  categoriasArr: CategoriaModel[] = [];
  textSearch: string;
  hayInfo =  false;

  Toast = Swal.mixin({
    toast: true,
    position: 'center-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

  constructor(private dialog: MatDialog,
              private sC: CategoriaService,
              private tls: HerramientasService) { }

  ngOnInit(): void {
    this.cargaInformacion();
  }

  cargaInformacion(){

    this.sC.getcategorias().subscribe( resp => {

      const categorias = [];

      if ( categorias.length !== 0 ){
        this.hayInfo = true;
        return;
      }

      resp.forEach( doc => {

        const item = {
          id: doc.id,
          idRestaurante: doc.data().idRestaurante,
          ...doc.data()
        };

        categorias.push( item );

      });

      this.categoriasArr = categorias;

    });

  }

  addItem( tipo ){

    let nuevoItem  = new CategoriaModel();

    const dialogRef = this.dialog.open(CategoriasDialogComponent, {
      width: '90%',
      data: {item: nuevoItem, tipo: tipo}
    });

    dialogRef.afterClosed().subscribe( data => {

      if ( !data ){
        return;
      }

      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text: 'Guardando...'
      });
      Swal.showLoading();

      this.sC.addcategoria( data )
             .then( resp => {

               Swal.close();

               this.Toast.fire({
                icon: 'success',
                title: 'Agregado correctamente!'
              });

               nuevoItem = data;
               nuevoItem.id = resp.id;

               this.categoriasArr.push( nuevoItem );

             }, err => {

              console.log('ERROR : ', err);

              Swal.fire({
                icon: 'error',
                title: 'Error Mess-01',
                text: 'Error al insertar, intentelo de nuevo, si el problema persiste contacte al equipo de Primario!',
                footer: `<a href="${ this.tls.linkPrimario }"> Equipo Primario : ${this.tls.linkPrimario} </a>`
              });

             });

    })
  }

  updateItem( item: CategoriaModel, tipo: string, posicion: number ){

    const dialogRef = this.dialog.open(CategoriasDialogComponent, {
      width: '90%',
      data: {item: item, tipo: tipo}
    });

    dialogRef.afterClosed().subscribe( data => {

      if ( !data ){
        return;
      }

      this.sC.updatecategoria( data )
              .then( resp => {

                this.categoriasArr.splice( posicion, 1, data);

                this.Toast.fire({
                  icon: 'success',
                  title: 'Editado correctamente!'
                });

                
              }, err => {
                
                Swal.fire({
                  icon: 'error',
                  title: 'Error Mess-02 ',
                  text: 'Error al editar!',
                  footer: '<a href>Why do I have this issue?</a>'
                });

              });

    });

  }

  deleteItem( item: CategoriaModel, posicion: number){

    this.sC.deletecategorias( item )
            .then( resp => {
              this.categoriasArr.splice( posicion, 1);

              this.Toast.fire({
                icon: 'success',
                title: 'Eliminado correctamente!'
              });

            }, err => {

              Swal.fire({
                icon: 'error',
                title: 'Error Men-03 ',
                text: 'Error al editar!',
                footer: '<a href>Why do I have this issue?</a>'
              });

            });

  }

  queHacer( item: CategoriaModel, tipo: string, posicion: number ){

    Swal.fire({
      title: 'Qué acción desea realizar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Editar!',
      cancelButtonText: 'Eliminar!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      showCloseButton: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        
        this.updateItem( item, tipo, posicion );
        
      } else if (
        /* Read more about handling disCissCls below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        
        Swal.fire({
          title: 'Esta seguro de eliminar el elemento?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminalo!',
          cancelButtonText: 'Cancelar!'
        }).then((result) => {
          if (result.value) {
            this.deleteItem(item, posicion);
          }
        })
      }
    });

  }

  onKeyUp( event ){

    this.textSearch = event.target.value;

    let busqueda = event.target.value.toLowerCase();

    $('#tableMain tbody tr').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(busqueda) > -1);
    });

  }

  limpiaText(){
    this.textSearch = '';
  }



}
