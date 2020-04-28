import { Component, OnInit, Inject } from '@angular/core';

import Swal from 'sweetalert2';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { MesaModel } from '../../models/mesa.model';

@Component({
  selector: 'app-mesas-dialogs',
  templateUrl: './mesas-dialogs.component.html',
  styleUrls: ['./mesas-dialogs.component.css']
})
export class MesasDialogsComponent implements OnInit {

  forma: FormGroup;

  tipo: string;
  titulo: string;

  itemMesa: MesaModel;

  constructor( private dialogRef: MatDialogRef<MesasDialogsComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private fb: FormBuilder) {

                this.itemMesa = new MesaModel();

                this.cargaItemMenu( data.item );
                this.crearFormulario();

                this.tipo = data.tipo;
                this.sTitulo(this.tipo);


               }

  ngOnInit(): void {
  }

  get mesaNoValido(){
    return this.forma.get('mesa').invalid && this.forma.get('mesa').touched;
  }

  crearFormulario(){

    this.forma = this.fb.group({
       mesa : [ this.itemMesa.mesa , Validators.required]
    });

  }

  cargaItemMenu( item: MesaModel ){

    if ( item ){

      this.itemMesa = item;

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

    this.itemMesa.mesa = this.forma.get('mesa').value;
    //Nota: Las categorias no se cargan ya que se realiza el cambio automaticamente

    this.dialogRef.close( this.itemMesa );

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
