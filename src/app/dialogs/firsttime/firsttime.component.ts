import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import Swal from 'sweetalert2';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Restaurante } from '../../classes/restaurante.class';
import { usuarioSesion } from '../../classes/usuarioSesion.class';
import { AuthmailService } from '../../services/authmail.service';

@Component({
  selector: 'app-firsttime',
  templateUrl: './firsttime.component.html',
  styleUrls: ['./firsttime.component.css']
})
export class FirsttimeComponent implements OnInit {

  formRest: FormGroup;
  formUser: FormGroup;

  restaurante: Restaurante;
  usuario: usuarioSesion;

  constructor( public dialogRef: MatDialogRef<FirsttimeComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any, 
               private fb: FormBuilder, 
               private auth: AuthmailService) {

    this.crearFormulario();

  }

  ngOnInit(): void {

    this.restaurante = new Restaurante();
    this.usuario = new usuarioSesion();

  }

  get nomRestNoValido(){
    return  this.formRest.get('nombreRest').invalid && this.formRest.get('nombreRest').touched;
  }

  get nombreUserNoValido(){
    return  this.formUser.get('nombreUser').invalid && this.formUser.get('nombreUser').touched;
  }

  /* get telefonoNoValido(){
    return  this.formRest.get('nomRest').touched;
  } */

  crearFormulario(){

    this.formRest = this.fb.group({
      nombreRest: ['', [Validators.required]],
      telefonoRest: ['', ],
      direccionRest: ['', ]
    });

    this.formUser = this.fb.group({
      nombreUser: ['', [Validators.required]],
      telefonoUser: ['', ]
    });

  }
  
  guardarRestUsuario(){

    if( this.formRest.invalid ){
      Swal.fire({
        icon: 'error',
        title: 'Error en apartado "Datos del Restaurante"',
        text: 'Favor de verificar que los campos fuerón llenados de manera correcta!'
      });

      return Object.values( this.formRest.controls ).forEach( control => {
        if( control instanceof FormGroup ){
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() );
        }else{
          control.markAllAsTouched();
        }
      });
    }

    if( this.formUser.invalid ){
      Swal.fire({
        icon: 'error',
        title: 'Error en el apartado "Datos del Usuario"',
        text: 'Favor de verificar que los campos fuerón llenados de manera correcta!'
      });

      return Object.values( this.formUser.controls ).forEach( control => {
        if( control instanceof FormGroup ){
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() );
        }else{
          control.markAllAsTouched();
        }
      });
    }

    this.auth.creaRestaurante( this.restaurante, this.usuario );

    this.dialogRef.close();

  }


}
