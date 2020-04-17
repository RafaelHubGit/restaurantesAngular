import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { UsuarioModel } from '../../models/usuario.model';
import { AuthmailService } from '../../services/authmail.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;
  form: FormGroup;

  constructor( private fb: FormBuilder,
                private auth: AuthmailService,
                private router: Router) { 

    this.crearFormulario();

  }

  ngOnInit(): void {

    this.usuario = new UsuarioModel();

  }

  get emailNoValido(){
    return  this.form.get('email').invalid && this.form.get('email').touched;
  }

  get passNoValido(){
    return this.form.get('pass').invalid && this.form.get('pass').touched;
  }

  crearFormulario(){

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      pass: ['', Validators.required]
    });

  }

  login(){
    if( this.form.invalid ){
      Swal.fire({
        icon: 'error',
        title: 'Datos Incorrectos',
        text: 'Favor de verificar que los datos esten llenados de manera correcta!'
      });

      return Object.values( this.form.controls ).forEach( control => {
        if( control instanceof FormGroup ){
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() );
        }else{
          control.markAllAsTouched();
        }
      });
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();

    this.auth.login( this.usuario)
              .then( resp => {
                Swal.close();
                const token = resp.user.refreshToken;
                this.auth.guardarToken( token );
                this.router.navigateByUrl('/home');
              }, (err) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al autenticar',
                  text: 'Verifique su usuario y contraseña.'
                });

              });
  }

  logInFacebook(){

    this.auth.authFacebook();

  }


}
