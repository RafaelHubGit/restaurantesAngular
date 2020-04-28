import { Component, OnInit, Inject } from '@angular/core';

import Swal from 'sweetalert2';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ItemMenuModel } from '../../models/itemMenu.model';

declare var $:any;

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.css']
})
export class ItemMenuComponent implements OnInit {

  forma: FormGroup;

  tipo: string;
  titulo: string;

  itemMenu: ItemMenuModel;

  categoriasA: {id: string, nombre: string }[] = [{ id: '1a2b', nombre: 'qwerty'}, { id: '1qw2', nombre: 'qwers' }];

  constructor( private dialogRef: MatDialogRef<ItemMenuComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private fb: FormBuilder) {
                
                this.itemMenu = new ItemMenuModel();

                this.cargaItemMenu( data.item );
                this.crearFormulario();
                this.cargarDataSelect();

                this.tipo = data.tipo;
                this.sTitulo(this.tipo);

                


  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.inicailizaMaterialize();
    
  }

  get nombreNoValido(){
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched;
  }

  get descripcionNoValido(){
    return this.forma.get('descripcion').invalid && this.forma.get('descripcion').touched;
  }

  get precioNoValido(){
    return this.forma.get('precio').invalid && this.forma.get('precio').touched;
  }

  get categorias(){
    return this.forma.get('categorias')
  }

  crearFormulario(){

    this.forma = this.fb.group({
       nombre : [ this.itemMenu.nombre , Validators.required],
       descripcion : [this.itemMenu.descripcion],
       precio: [ this.itemMenu.precio, Validators.required],
       categorias: [ this.itemMenu.categorias, Validators.required]
    });

  }

  cargaItemMenu( item: ItemMenuModel ){

    if ( item ){

      this.itemMenu = item;

    }

  }

  guardar(){

    if( this.forma.invalid ){
      Swal.fire({
        icon: 'error',
        title: 'Datos Incorrectos',
        text: 'Favor de verificar que los datos esten llenados de manera correcta!'
      });

      return Object.values( this.forma.controls ).forEach( control => {
        if( control instanceof FormGroup ){
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() );
        }else{
          control.markAllAsTouched();
        }
      });
    }

    this.itemMenu.nombre = this.forma.get('nombre').value;
    this.itemMenu.descripcion = this.forma.get('descripcion').value;
    this.itemMenu.precio = this.forma.get('precio').value;
    //Nota: Las categorias no se cargan ya que se realiza el cambio automaticamente

    this.dialogRef.close( this.itemMenu );

  }

  cargarDataSelect(){

    this.forma.get('categorias').valueChanges
              .subscribe( data => {
                this.itemMenu.categorias = data;
              });
  }

  cerrarDialog(){
    this.dialogRef.close();
  }

  sTitulo( tipo: string){

    if( tipo == 'add' ){
      this.titulo = "Agregar Nuevo"
    }else{
      this.titulo = "Editar"
    }

  }

  inicailizaMaterialize(){

    $('#categorias').formSelect();

  }

}
