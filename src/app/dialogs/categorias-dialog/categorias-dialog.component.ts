import { Component, OnInit, Inject } from '@angular/core';

import Swal from 'sweetalert2';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CategoriaModel } from '../../models/categoria.model';

@Component({
  selector: 'app-categorias-dialog',
  templateUrl: './categorias-dialog.component.html',
  styleUrls: ['./categorias-dialog.component.css']
})
export class CategoriasDialogComponent implements OnInit {

  forma: FormGroup;

  tipo: string;
  titulo: string;

  itemCategoria: CategoriaModel;

  constructor( private dialogRef: MatDialogRef<CategoriasDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private fb: FormBuilder) {

    this.itemCategoria = new CategoriaModel();

    this.cargaItemMenu( data.item );
    this.crearFormulario();

    this.tipo = data.tipo;
    this.sTitulo(this.tipo);

  }

  ngOnInit(): void {
  }


  get categoriaNoValido(){
    return this.forma.get('categoria').invalid && this.forma.get('categoria').touched;
  }

  crearFormulario(){

    this.forma = this.fb.group({
      categoria : [ this.itemCategoria.categoria , Validators.required]
    });

  }

  cargaItemMenu( item: CategoriaModel ){

    if ( item ){

      this.itemCategoria = item;

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
        if ( control instanceof FormGroup ){
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() );
        }else{
          control.markAllAsTouched();
        }
      });
    }

    this.itemCategoria.categoria = this.forma.get('categoria').value;

    this.dialogRef.close( this.itemCategoria );

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




}
