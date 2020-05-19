import { Component, OnInit, Inject } from '@angular/core';

import Swal from 'sweetalert2';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { AreaModel } from '../../models/area.model';

@Component({
  selector: 'app-areas-dialog',
  templateUrl: './areas-dialog.component.html',
  styleUrls: ['./areas-dialog.component.css']
})
export class AreasDialogComponent implements OnInit {

  forma: FormGroup;

  tipo: string;
  titulo: string;

  itemArea: AreaModel;

  constructor(private dialogRef: MatDialogRef<AreasDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {

    this.itemArea = new AreaModel();

    this.cargaItemMenu( data.item );
    this.crearFormulario();

    this.tipo = data.tipo;
    this.sTitulo(this.tipo);

  }

  ngOnInit(): void {
  }

  get nombreNoValido(){
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched;
  }

  crearFormulario(){

    this.forma = this.fb.group({
       nombre : [ this.itemArea.nombre , Validators.required]
    });

  }

  cargaItemMenu( item: AreaModel ){

    if ( item ){

      this.itemArea = item;

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

    this.itemArea.nombre = this.forma.get('nombre').value;

    this.dialogRef.close( this.itemArea );

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
