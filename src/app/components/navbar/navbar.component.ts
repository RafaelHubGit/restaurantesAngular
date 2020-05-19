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

//Models
import { MenuModel } from '../../models/menu.model';
import { NavBarService } from '../../services/nav-bar.service';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  menuArr: MenuModel[] = [];
  menuCatArr: MenuModel[] = [];
  menuOperArr: MenuModel[] = [];

  usuarioSesion: usuarioSesion;
  restaurante: Restaurante;

  constructor( private auth: AuthmailService,
               private nbS: NavBarService,
               private router: Router,
               private dialog: MatDialog){

    this.usuarioSesion = this.auth.leerUsuarioSesionStorage();

    if ( this.usuarioSesion.primeraVez ){
      this.abreModalPrimeraVez();
    }

  }

  ngOnInit(): void {

    this.getMenu();
    this.getMenuFromArea();

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

  getMenu(){

    this.nbS.getMenu().subscribe( resp => {

      let menuTemp: MenuModel[] = [];

      resp.forEach( doc => {

        const item: any = {
          id: doc.id,
          ...doc.data()
        };

        menuTemp.push( item );

      });

      this.menuArr = menuTemp;

      this.menuArr.filter(x => x.tipo === 'catalogo')
                  .map(x => {
                        this.menuCatArr.unshift( x );
                      });

      this.menuArr.filter(x => x.tipo === 'operacion')
                  .map(x => {
                        this.menuOperArr.unshift( x );
                      });

    });

  }

  getMenuFromArea(){

    this.nbS.getMenuFromArea()
              .subscribe( resp => {

                let menu: any;

                resp.forEach( doc => {
                  menu = doc.payload.doc.data();

                  const MENUTEMP = {
                    ...menu,
                    id: doc.payload.doc.id
                  }

                  this.menuOperArr.push( MENUTEMP );

                });

              });

  }

  closeMenu(){

    $('#slide-out').sidenav('close');

  }

}
