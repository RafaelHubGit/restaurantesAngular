import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { MeserosService } from '../../services/meseros.service';

import { ItemMeseroModel } from '../../models/itemMesero.model';

import { MeserosDialogComponent } from '../../dialogs/meseros-dialog/meseros-dialog.component';

import Swal from 'sweetalert2';
declare var $:any;

@Component({
  selector: 'app-meseros',
  templateUrl: './meseros.component.html',
  styleUrls: ['./meseros.component.css']
})
export class MeserosComponent implements OnInit {

  meserosArr: ItemMeseroModel[] = [];
  linkPrimario = 'http://primario.com.mx';
  textSearch: string;
  hayInfo =  false;

  Toast = Swal.mixin({
    toast: true,
    position: 'center-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

  constructor( private dialog: MatDialog,
               private sM: MeserosService) { }

  ngOnInit(): void {
    this.cargaInformacion();
  }

  cargaInformacion(){

    this.sM.getMeseros().subscribe( resp => {

      const meseros: ItemMeseroModel[] = [];

      if ( meseros.length !== 0 ){
        this.hayInfo = true;
        return;
      }

      resp.forEach( doc => {

        const item: ItemMeseroModel = {
          id: doc.id,
          idRestaurante: doc.data().idRestaurante,
          nombre: doc.data().nombre
        };

        meseros.push( item );

      });

      this.meserosArr = meseros;

    });

  }

  addItem( tipo ){

    let nuevoItem  = new ItemMeseroModel();

    const dialogRef = this.dialog.open(MeserosDialogComponent, {
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

      this.sM.addMesero( data )
             .then( resp => {

               Swal.close();
              
               this.Toast.fire({
                icon: 'success',
                title: 'Agregado correctamente!'
              });

               nuevoItem = data;
               nuevoItem.id = resp.id;
              
               this.meserosArr.push( nuevoItem );

             }, err => {

              console.log("ERROR : ", err);

              Swal.fire({
                icon: 'error',
                title: 'Error Mes-01',
                text: 'Error al insertar, intentelo de nuevo, si el problema persiste contacte al equipo de Primario!',
                footer: `<a href="${ this.linkPrimario }"> Equipo Primario : ${this.linkPrimario} </a>`
              });

             });

    })
  }

  updateItem( item: ItemMeseroModel, tipo: string, posicion: number ){

    const dialogRef = this.dialog.open(MeserosDialogComponent, {
      width: '90%',
      data: {item: item, tipo: tipo}
    });

    dialogRef.afterClosed().subscribe( data => {

      if ( !data ){
        return;
      }

      this.sM.updateMesero( data )
              .then( resp => {

                this.meserosArr.splice( posicion, 1, data);

                this.Toast.fire({
                  icon: 'success',
                  title: 'Editado correctamente!'
                });

                
              }, err => {
                
                Swal.fire({
                  icon: 'error',
                  title: 'Error Mes-02 ',
                  text: 'Error al editar!',
                  footer: '<a href>Why do I have this issue?</a>'
                });

              });

    });

  }

  deleteItem( item: ItemMeseroModel, posicion: number){

    this.sM.deleteMesero( item )
            .then( resp => {
              this.meserosArr.splice( posicion, 1);

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

  queHacer( item: ItemMeseroModel, tipo: string, posicion: number ){

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
        /* Read more about handling dismissals below */
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
