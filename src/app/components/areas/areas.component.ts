import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { AreaService } from '../../services/area.service';
import { HerramientasService } from '../../services/herramientas.service';

import { AreaModel } from '../../models/area.model';
import { AreasDialogComponent } from '../../dialogs/areas-dialog/areas-dialog.component';

import Swal from 'sweetalert2';
declare var $:any;

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {

  areasArr: AreaModel[] = [];
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
              private sA: AreaService,
              private tls: HerramientasService) { }

  ngOnInit(): void {
    this.cargaInformacion();
  }


  cargaInformacion(){

    this.sA.getAreas().subscribe( resp => {

      const areas= [];

      if ( areas.length !== 0 ){
        this.hayInfo = true;
        return;
      }

      resp.forEach( doc => {

        const item = {
          id: doc.id,
          idRestaurante: doc.data().idRestaurante,
          ...doc.data()
        };

        areas.push( item );

      });

      this.areasArr = areas;

    });

  }

  addItem( tipo ){

    let nuevoItem  = new AreaModel();

    const dialogRef = this.dialog.open(AreasDialogComponent, {
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

      this.sA.addArea( data )
             .then( resp => {

              this.sA.addMenu( data, resp.id)
                  .then( resp => {

                    Swal.close();

                    this.Toast.fire({
                      icon: 'success',
                      title: 'Agregado correctamente!'
                    });

                  });

              nuevoItem = data;
              nuevoItem.id = resp.id;

              this.areasArr.push( nuevoItem );

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

  updateItem( item: AreaModel, tipo: string, posicion: number ){

    const dialogRef = this.dialog.open(AreasDialogComponent, {
      width: '90%',
      data: {item: item, tipo: tipo}
    });

    dialogRef.afterClosed().subscribe( data => {

      if ( !data ){
        return;
      }

      this.sA.updateArea( data )
              .then( resp => {

                this.areasArr.splice( posicion, 1, data);

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

  deleteItem( item: AreaModel, posicion: number){

    this.sA.deleteAreas( item )
            .then( resp => {
              this.areasArr.splice( posicion, 1);

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

  queHacer( item: AreaModel, tipo: string, posicion: number ){

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
        /* Read more about handling disAissals below */
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
