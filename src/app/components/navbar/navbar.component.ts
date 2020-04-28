import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

//Services
import { AuthmailService } from '../../services/authmail.service';

//Class
import { usuarioSesion } from '../../classes/usuarioSesion.class';

//Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FirsttimeComponent } from '../../dialogs/firsttime/firsttime.component';
import { Restaurante } from '../../classes/restaurante.class';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuarioSesion: usuarioSesion;
  restaurante: Restaurante;

  constructor( private auth: AuthmailService,
               private router: Router, 
               private dialog: MatDialog){

    this.usuarioSesion = this.auth.leerUsuarioSesionStorage();

    if ( this.usuarioSesion.primeraVez ){
      this.abreModalPrimeraVez();
    }

  }

  ngOnInit(): void {
  }


  abreMenu(){
    $('.sidenav').sidenav(
      {
        draggable: true
      }
    );
  }

  logout(){
    this.auth.logout()
              .then( resp => {
              }, err => {
              });
    this.router.navigateByUrl('/login');
  }

  abreModalPrimeraVez(){

    Swal.fire({
      title: '<strong>Bienvenido!</strong>',
      icon: 'info',
      html:
        `Gracias por unirte a Primario!
        <br>
        Antes de comenzar realicemos algunas configuraciones.`,
      focusConfirm: false,
      confirmButtonText:
        '<i class="material-icons">thumb_up</i> Genial!',
      confirmButtonAriaLabel: 'Thumbs up, great!',
    })

    const dialogRef = this.dialog.open(FirsttimeComponent, {
      width: '90%',
      disableClose: true
    });

    /* dialogRef.afterClosed().subscribe(result => {
      
      if( !result ){
        return;
      }

      console.log("Regreso :", result);

      marcador.titulo = result.titulo;
      marcador.descripcion = result.descripcion;
      this.guardarStorage();
      this.snackBar.open('Marcador Actualizado', 'Cerrar', {duration: 3000});

    }); */

  }

}
