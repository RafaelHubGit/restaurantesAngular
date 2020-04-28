import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

//Models
import { UsuarioModel } from '../../models/usuario.model';
import { usuarioSesion } from '../../classes/usuarioSesion.class';
 
//Servicio
import { AuthmailService } from '../../services/authmail.service';

import Swal from 'sweetalert2';


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

    this.auth.logout();
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
              .then( ( respUser ) => {

                Swal.close();
                const token = respUser.user.refreshToken;
                this.auth.guardarToken( token );

                const usuario = new usuarioSesion();

                this.auth.getUsuario( respUser.user.email )
                  .subscribe( (resp) => {

                    /* console.log("largo : ", resp.empty); */
                    if( !resp.empty ){

                      resp.forEach( doc => {

                        usuario.email = doc.data().email;
                        usuario.nombre = doc.data().nombre;
                        usuario.usuario = doc.data().usuario;
                        usuario.fechaRegistro = doc.data().fechaRegistro;
                        usuario.telefono = doc.data().telefono;
                        usuario.primeraVez = doc.data().primeraVez;
                        usuario.idRestaurante = doc.data().idRestaurante;
                      });

                    }else{
                      usuario.email = respUser.user.email;
                      usuario.nombre = respUser.user.email;
                      usuario.usuario = respUser.user.email;
                      usuario.fechaRegistro = new Date();
                    }

                    this.auth.guardarUsuarioStorage( usuario );
                    this.router.navigateByUrl('/home');
                      
                  });

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
