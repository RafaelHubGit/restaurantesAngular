import { Component, OnInit, Inject } from '@angular/core';

import Swal from 'sweetalert2';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ItemMeseroModel } from '../../models/itemMesero.model';


@Component({
  selector: 'app-meseros-dialog',
  templateUrl: './meseros-dialog.component.html',
  styleUrls: ['./meseros-dialog.component.css']
})
export class MeserosDialogComponent implements OnInit {

  forma: FormGroup;

  tipo: string;
  titulo: string;

  itemMesero: ItemMeseroModel;

  constructor( private dialogRef: MatDialogRef<MeserosDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private fb: FormBuilder) { 

                this.itemMesero = new ItemMeseroModel();

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
       nombre : [ this.itemMesero.nombre , Validators.required]
    });

  }

  cargaItemMenu( item: ItemMeseroModel ){

    if ( item ){

      this.itemMesero = item;

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

    this.itemMesero.nombre = this.forma.get('nombre').value;
    //Nota: Las categorias no se cargan ya que se realiza el cambio automaticamente

    this.dialogRef.close( this.itemMesero );

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
