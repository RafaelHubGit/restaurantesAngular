import { Component, OnInit, Inject } from '@angular/core';

import Swal from 'sweetalert2';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ItemMenuModel } from '../../models/itemMenu.model';

import { GettersService } from '../../services/getters.service';
import { CategoriaModel } from '../../models/categoria.model';
import { AreaModel } from '../../models/area.model';
import { HerramientasService } from '../../services/herramientas.service';

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

  categoriasArr: CategoriaModel[] = [];
  areasArr: AreaModel[] = [];

  constructor( private dialogRef: MatDialogRef<ItemMenuComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private fb: FormBuilder,
               private getS: GettersService,
               private tls: HerramientasService) {


    this.itemMenu = new ItemMenuModel();

    /* NOTA!!! Se tiene que vaciar la informacion por que si no hace las modificaciones directamente en la informacion del 
    menubar.component, si se quita ENGINE_METHOD_STORE, al cargarItemMenu y transformar la informacion de areas y 
    categorias a arrays sencillos, se edita directamente la info de menubar.component */
    this.itemMenu = { ...data.item};

    this.cargaItemMenu( this.itemMenu );
    this.crearFormulario();
    this.cargarDataSelect();

    this.tipo = data.tipo;
    this.sTitulo(this.tipo);

  }

  ngOnInit(): void {

    this.categoriasArr = this.getS.categoriaArrGet;
    this.areasArr = this.getS.areaArrGet;

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
    return this.forma.get('categorias') && this.forma.get('categorias').touched;
  }

  get areas(){
    return this.forma.get('areas') && this.forma.get('areas').touched;
  }

  crearFormulario(){

    this.forma = this.fb.group({
       nombre : [ this.itemMenu.nombre , Validators.required],
       descripcion : [this.itemMenu.descripcion],
       precio: [ this.itemMenu.precio, Validators.required],
       categorias: [ this.itemMenu.categorias, Validators.required],
       areas: [ this.itemMenu.areas, Validators.required]
    });

  }

  /* Carga la informacion al formulario */
  cargaItemMenu( item: ItemMenuModel ){

    if ( Object.keys(item).length !== 0 ){

      this.itemMenu = item;
      this.itemMenu.categorias = this.tls.getIdFromArr( item.categorias );
      this.itemMenu.areas = this.tls.getIdFromArr( item.areas );

    }

  }

  guardar(){

    if ( this.forma.invalid ){
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
    this.itemMenu.categorias = this.getS.getCategoriaModel( this.forma.get('categorias').value );
    this.itemMenu.areas = this.getS.getAreaModel( this.forma.get('areas').value );
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

    if ( tipo === 'add' ){
      this.titulo = 'Agregar Nuevo';
    }else{
      this.titulo = 'Editar';
    }

  }

  inicailizaMaterialize(){

    $('#categorias').formSelect();

  }

}
