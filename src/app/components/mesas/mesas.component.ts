import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { MesasService } from '../../services/mesas.service';

import { MesaModel } from '../../models/mesa.model';
import { MesasDialogsComponent } from '../../dialogs/mesas-dialogs/mesas-dialogs.component';

import Swal from 'sweetalert2';
declare var $:any;

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {

  mesasArr: MesaModel[] = [];
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
               private sM: MesasService) { }

  ngOnInit(): void {
    this.cargaInformacion();
  }

  cargaInformacion(){

    this.sM.getMesas().subscribe( resp => {

      const mesas: MesaModel[] = [];

      if ( mesas.length !== 0 ){
        this.hayInfo = true;
        return;
      }

      resp.forEach( doc => {

        const item: MesaModel = {
          id: doc.id,
          idRestaurante: doc.data().idRestaurante,
          mesa: doc.data().mesa
        };

        mesas.push( item );

      });

      this.mesasArr = mesas;

    });

  }

  addItem( tipo ){

    let nuevoItem  = new MesaModel();

    const dialogRef = this.dialog.open(MesasDialogsComponent, {
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

      this.sM.addMesa( data )
             .then( resp => {

               Swal.close();
              
               this.Toast.fire({
                icon: 'success',
                title: 'Agregado correctamente!'
              });

               nuevoItem = data;
               nuevoItem.id = resp.id;
              
               this.mesasArr.push( nuevoItem );

             }, err => {

              console.log('ERROR : ', err);

              Swal.fire({
                icon: 'error',
                title: 'Error Mess-01',
                text: 'Error al insertar, intentelo de nuevo, si el problema persiste contacte al equipo de Primario!',
                footer: `<a href="${ this.linkPrimario }"> Equipo Primario : ${this.linkPrimario} </a>`
              });

             });

    })
  }

  updateItem( item: MesaModel, tipo: string, posicion: number ){

    const dialogRef = this.dialog.open(MesasDialogsComponent, {
      width: '90%',
      data: {item: item, tipo: tipo}
    });

    dialogRef.afterClosed().subscribe( data => {

      if ( !data ){
        return;
      }

      this.sM.updateMesero( data )
              .then( resp => {

                this.mesasArr.splice( posicion, 1, data);

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

  deleteItem( item: MesaModel, posicion: number){

    this.sM.deleteMesas( item )
            .then( resp => {
              this.mesasArr.splice( posicion, 1);

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

  queHacer( item: MesaModel, tipo: string, posicion: number ){

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
