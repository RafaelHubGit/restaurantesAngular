import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthmailService } from '../../services/authmail.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  usuario: UsuarioModel;
  form: FormGroup;

  constructor( private fb: FormBuilder,
                private auth: AuthmailService){ 

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

  get pass2NoValido(){
    const pass1 = this.form.get('pass').value;
    const pass2 = this.form.get('pass2').value;

    return ( pass1 === pass2 ) ? false : true && this.form.get('pass').touched;
  }

  crearFormulario(){

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      pass: ['', Validators.required],
      pass2: ['', Validators.required]
    });

  }



  signIn(){
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


    this.auth.nuevoUsuario( this.usuario )
              .then( resp => {
                Swal.close();
                const token = resp.user.refreshToken;
                this.auth.guardarToken( token );
              }, err => {
                console.log("Errores : ", err);

                if ( err.code === 'auth/email-already-in-use' ){
                  Swal.fire({
                    icon: 'warning',
                    title: 'El usuario ya se encuentra registrado',
                  });
                }
                if ( err.code === 'auth/weak-password'){
                  Swal.fire({
                    icon: 'warning',
                    title: 'La contraseña debe contener al menos 6 caracteres.',
                  });
                }
              });
  }

}
