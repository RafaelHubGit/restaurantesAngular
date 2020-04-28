import { Component, OnInit } from '@angular/core';

import { MenuService } from '../../services/menu.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ItemMenuComponent } from '../../dialogs/item-menu/item-menu.component';
import { ItemMenuModel } from '../../models/itemMenu.model';
import Swal from 'sweetalert2';

declare var $:any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  itemsMenu: ItemMenuModel[] = [];
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
               private sM: MenuService) {

               }

  ngOnInit(): void {

    this.cargaInformacion();

  }

  cargaInformacion(){

    this.sM.getMenu().subscribe( resp => {

      const items: ItemMenuModel[] = [];

      if ( items.length !== 0 ){
        this.hayInfo = true;
        return;
      }

      resp.forEach( doc => {

        const item: ItemMenuModel = {
          idMenu: doc.id,
          idRestaurante: doc.data().idRestaurante,
          nombre: doc.data().nombre,
          descripcion: doc.data().descripcion,
          precio: doc.data().precio,
          categorias: doc.data().categorias
        };

        items.push( item );

      });

      this.itemsMenu = items;

    });

  }

  addItem( tipo ){

    let nuevoItem  = new ItemMenuModel();

    const dialogRef = this.dialog.open(ItemMenuComponent, {
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

      this.sM.addItemMenu( data )
             .then( resp => {

               Swal.close();
              
              this.Toast.fire({
                icon: 'success',
                title: 'Agregado correctamente!'
              });

              nuevoItem = data;
              nuevoItem.idMenu = resp.id;
              
              this.itemsMenu.push( nuevoItem );

             }, err => {

              console.log("ERROR : ", err);

              Swal.fire({
                icon: 'error',
                title: 'Error Men-01',
                text: 'Error al insertar, intentelo de nuevo, si el problema persiste contacte al equipo de Primario!',
                footer: `<a href="${ this.linkPrimario }"> Equipo Primario : ${this.linkPrimario} </a>`
              });

             });

    })
  }

  updateItem( item: ItemMenuModel, tipo: string, posicion: number ){

    const dialogRef = this.dialog.open(ItemMenuComponent, {
      width: '90%',
      data: {item: item, tipo: tipo}
    });

    dialogRef.afterClosed().subscribe( data => {

      if ( !data ){
        return;
      }

      this.sM.updateItemMenu( data )
              .then( resp => {

                this.itemsMenu.splice( posicion, 1, data);

                this.Toast.fire({
                  icon: 'success',
                  title: 'Editado correctamente!'
                });

                
              }, err => {
                
                Swal.fire({
                  icon: 'error',
                  title: 'Error Men-02 ',
                  text: 'Error al editar!',
                  footer: '<a href>Why do I have this issue?</a>'
                });

              });

    });

  }

  deleteItem( item: ItemMenuModel, posicion: number){

    this.sM.deleteItemMenu( item )
            .then( resp => {
              this.itemsMenu.splice( posicion, 1);

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

  queHacer( item: ItemMenuModel, tipo: string, posicion: number ){

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

    $("#tableMenu tbody tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(busqueda) > -1);
    });

  }

  limpiaText(){
    this.textSearch = '';
  }

}
