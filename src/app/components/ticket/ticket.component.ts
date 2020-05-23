import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';

import { TicketService } from '../../services/ticket.service';
import { TicketDatosModel } from '../../models/ticketDatos.model';
import { TicketProductoModel, TicketProductoDetalleModel, ProdToAreaModel } from '../../models/ticketProducto.model';
import { TicketTipoPagoModel } from '../../models/ticketTipoPago.model';
import { ItemMenuModel } from '../../models/itemMenu.model';

import { HerramientasService } from '../../services/herramientas.service';
import { GettersService } from '../../services/getters.service';

import Swal from 'sweetalert2';
import { ItemMeseroModel } from '../../models/itemMesero.model';
import { MesaModel } from '../../models/mesa.model';
declare var $: any;

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  idRoute: string;
  idRestaurante: string;

  formDatos: FormGroup;

  ticketDatos: TicketDatosModel;
  ticketProductosArr: TicketProductoModel[] = [];
  ticketProductosArrTemp: TicketProductoModel[] = [];
  ticketProdsDetalle: TicketProductoDetalleModel;
  idProductosArr = [];

  /* arrays para los select */
  itemsMenuArr: ItemMenuModel[] = [];
  meserosArr: ItemMeseroModel[] = [];
  mesasArr: MesaModel[] = [];

  prodTemp: TicketProductoModel;
  posicionTemp: number;
  dataTipo: any;

  linkPrimario = 'http://primario.com.mx';
  textSearch: string;
  hayInfo =  false;
  cantidadM = 5;
  tipoM = 'entraSale';

  Toast = Swal.mixin({
    toast: true,
    position: 'center-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

  constructor( private dialog: MatDialog,
               private sT: TicketService,
               private tls: HerramientasService,
               private getS: GettersService,
               private fb: FormBuilder,
               private route: ActivatedRoute,
               private router: Router ) {

                this.idRoute = this.route.snapshot.paramMap.get('id');
                this.idRestaurante = tls.getIdRestaurante();

                this.dataTipo = getS.dataTipo.tipo;
                this.ticketDatos = new TicketDatosModel();
                this.ticketProdsDetalle = new TicketProductoDetalleModel();
                this.crearFormulario();

               }

  ngOnInit(): void {

    this.cargaInformacion();

  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    this.inicailizaMaterialize();

  }

  get noOrdenNoValido(){
    return  this.formDatos.get('noOrden').invalid && this.formDatos.get('noOrden').touched;
  }

  crearFormulario(){

    this.formDatos = this.fb.group({
      noOrden: [ 1 ],
      noComensales: [ this.ticketDatos.noComensales, [Validators.required] ],
      meseros: [ this.ticketDatos.meseros ],
      mesas: [ this.ticketDatos.mesas, ],
      nota: [ this.ticketDatos.nota, ]
    });

  }

  cargaDataAlFormulario( dataForm: TicketDatosModel ){

    this.formDatos.reset({

      noOrden: dataForm.noOrden,
      noComensales: dataForm.noComensales,
      meseros: this.tls.getIdFromArr( dataForm.meseros ),
      mesas: this.tls.getIdFromArr( dataForm.mesas ),
      nota: dataForm.nota

    });

  }

  cargaInformacion(){

    /* cargar informacion si llega un id */

    if ( this.idRoute !== 'nuevo' ){
      this.getDataTicketById( this.idRoute );
      this.getProductTicketById( this.idRoute );

    }

    this.getProdsMenu();
    this.getMeseros();
    this.getMesas();

  }

  getProdsMenu(){

    this.itemsMenuArr = this.getS.menuArrGet;

  }


  getMeseros(){

    this.meserosArr = this.getS.meserosArrGet;

  }

  getMesas(){

    this.mesasArr = this.getS.mesasArrGet;

  }

  /* carga la informacion cuando entra en editar 
  carga la informacion del primer formulario */
  getDataTicketById( idTicket: string ){

    let TICKETTEMP: any;

    this.sT.getDataTicketById( idTicket )
            .subscribe( resp => {

              TICKETTEMP = {
                ...resp.data(),
                id: resp.id
              };

              this.ticketDatos = TICKETTEMP;

              /* carga los datos al formulario en cuanto trae la informacion  */
              this.cargaDataAlFormulario( TICKETTEMP );
              this.idProductosArr = TICKETTEMP.productos;

            });
  }

  /* es acompañado de la funcion getDataTicketById, pero este carga los productos seleccionados */
  getProductTicketById( idTicket: string ){

    this.sT.getProductTicketById( idTicket )
            .subscribe( resp => {

              let ticketProdArrTemp: any;
              let ticketProdDetalle: any;

              if ( resp.empty ){
                return;
              }

              resp.forEach( doc => {

                ticketProdDetalle = {
                  ...doc.data(),
                  id: doc.id
                }
                ticketProdArrTemp = doc.data().productos;

                this.ticketProdsDetalle = ticketProdDetalle;
                this.ticketProductosArr = ticketProdArrTemp;

              });

            });

  }

  guardar(){

    if ( this.formDatos.invalid ){
      Swal.fire({
        icon: 'error',
        title: 'Error en apartado "Datos del Restaurante"',
        text: 'Favor de verificar que los campos fuerón llenados de manera correcta!'
      });

      return Object.values( this.formDatos.controls ).forEach( control => {
        if ( control instanceof FormGroup ){
          Object.values( control.controls ).forEach( control => control.markAllAsTouched() );
        }else{
          control.markAllAsTouched();
        }
      });
    }

    if ( this.ticketProductosArr.length === 0 ){
      Swal.fire({
        icon: 'warning',
        title: 'No hay elementos agregados',
        text: 'Debe agregar al menos un elemento para continuar con la Orden!'
      });
      return;
    }

    this.letDataToModel();

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Guardando...'
    });
    Swal.showLoading();

    if ( this.idRoute === 'nuevo' ){
      this.addTicket();
    } else {
 
      this.updateTicket();

    }


  }

  addTicket(){

    let peticion: any;
    const fecha = new Date();

    this.sT.getNoOrden().subscribe( resp => {

      let noOrdenTemp;

      if ( resp.empty ){
        noOrdenTemp = 1;
      }

      resp.forEach( doc => {

        noOrdenTemp = doc.data().noOrden + 1;

      });

      this.ticketDatos.noOrden = noOrdenTemp;
      this.ticketDatos.fecha = fecha;
      this.ticketDatos.anio = this.tls.getYear( fecha );
      this.ticketDatos.mes = this.tls.getMonth( fecha );
      this.ticketDatos.dia = this.tls.getDay( fecha );
      this.ticketDatos.hora = this.tls.getHours( fecha );
      this.ticketDatos.minuto = this.tls.getMinutes( fecha );
      this.ticketDatos.status = 'ordenado';

      peticion = this.sT.addTicket( this.ticketDatos );

      peticion.then( resp => {

        this.creaTicketProdDetalle( resp.id, this.ticketDatos.noOrden );

      }, err => {
        Swal.fire({
          icon: 'error',
          title: 'Error Tkt-01',
          text: 'Error al insertar, intentelo de nuevo, si el problema persiste contacte al equipo de Primario!',
          footer: `<a href="${ this.linkPrimario }"> Equipo Primario : ${this.linkPrimario} </a>`
        });

      });

    });

  }

  updateTicket() {

    console.log('update 1 : ', this.ticketDatos);

    this.sT.updateTicket( this.ticketDatos )
        .then( resp => {

          this.updateTicketProdDetalle();

        }, err => {
          Swal.fire({
            icon: 'error',
            title: 'Error Tkt-01',
            text: 'Error al insertar, intentelo de nuevo, si el problema persiste contacte al equipo de Primario!',
            footer: `<a href="${ this.linkPrimario }"> Equipo Primario : ${this.linkPrimario} </a>`
          });
        });

  }

  creaTicketProdDetalle( idTicket: string, noOrden: number){

    const fecha = new Date();

    this.ticketProdsDetalle.idTicket = idTicket;
    this.ticketProdsDetalle.fecha = fecha;
    this.ticketProdsDetalle.anio =  this.tls.getYear(fecha);
    this.ticketProdsDetalle.mes =  this.tls.getMonth(fecha);
    this.ticketProdsDetalle.dia = this.tls.getDay(fecha);
    this.ticketProdsDetalle.hora =  this.tls.getHours(fecha);
    this.ticketProdsDetalle.minuto =  this.tls.getMinutes(fecha);
    this.ticketProdsDetalle.productos = this.ticketProductosArr;

    this.sT.addTicketProds( this.ticketProdsDetalle ).then( resp => {

      this.addproToArea( idTicket );

      Swal.close();
  
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Número de Orden : ${ noOrden }`,
        showConfirmButton: false,
        timer: 2000
      });

      this.router.navigate(['/home/tickets']);

    });

  }

  updateTicketProdDetalle(){

    this.ticketProdsDetalle.productos = this.ticketProductosArr;

    this.sT.updateTicketProds( this.ticketProdsDetalle ).then( resp => {

      /* this.addproToArea( idTicket ); */

      Swal.close();
  
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Modificado correctamente`,
        showConfirmButton: false,
        timer: 2000
      });

      this.router.navigate(['/home/tickets']);

    });

  }

  /* crea y agrega los prouctos a la coleccion ProdToAreaModel */
  addproToArea( idTicket: string ){

    const fecha = new Date();
    this.ticketProductosArr.forEach( item => {

      let prods: ProdToAreaModel = {
        ...item,
        id: this.tls.generaId( fecha ),
        categorias: this.tls.getIdFromArr( item.categorias ),
        areas: this.tls.getIdFromArr( item.areas ),
        idRestaurante: this.idRestaurante,
        idTicket,
        fecha,
        anio: this.tls.getYear( fecha ),
        mes: this.tls.getMonth( fecha ),
        dia: this.tls.getDay( fecha ),
        hora: this.tls.getHours( fecha ),
        minuto: this.tls.getMinutes( fecha )
      };

      this.sT.addProdsToArea( prods )
            .then( resp => {
              
            });
    });

  }

  updateProToArea( idTicket: string ){

    const fecha = new Date();
    this.ticketProductosArr.forEach( item => {

      let prods: ProdToAreaModel = {
        ...item,
        categorias: this.tls.getIdFromArr( item.categorias ),
        areas: this.tls.getIdFromArr( item.areas ),
        idRestaurante: this.idRestaurante,
        idTicket,
        fecha,
        anio: this.tls.getYear( fecha ),
        mes: this.tls.getMonth( fecha ),
        dia: this.tls.getDay( fecha ),
        hora: this.tls.getHours( fecha ),
        minuto: this.tls.getMinutes( fecha )
      };

      this.sT.addProdsToArea( prods )
            .then( resp => {
              
            });
    });

  }

  letDataToModel(){

    this.ticketDatos.idRestaurante = this.idRestaurante;
    /* this.ticketDatos.noOrden = this.formDatos.get('noOrden').value; */
    this.ticketDatos.meseros = this.getS.getMeserosModel( this.formDatos.get('meseros').value );
    this.ticketDatos.mesas = this.getS.getMesasModel( this.formDatos.get('mesas').value );
    this.ticketDatos.noComensales = this.formDatos.get('noComensales').value;
    /* this.ticketDatos.productos = [...this.ticketProductosArr]; */
    this.ticketDatos.productos = this.idProductosArr;
    this.ticketDatos.cantdProds = this.ticketProductosArr.length + 1;
    this.ticketDatos.nota = this.formDatos.get('nota').value;
    this.ticketDatos.subtotal = this.calculaSubtotal();

  }

  calculaSubtotal(){

    let subtotal = 0;

    for (let i = 0; i <= this.ticketProductosArr.length - 1; i++){

      subtotal = subtotal + this.ticketProductosArr[i].total;

    }

    return subtotal;

  }

  eliminarProd( item: TicketProductoModel, i: number ){

    Swal.fire({
      title: 'Esta seguro de eliminar el elemento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo!',
      cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.ticketProductosArr.splice( i , 1);
      }
    });

  }

  seleccionaArticulo( item: ItemMenuModel ){

    let itemProd = new TicketProductoModel();

    const ITEMPROD = {

      id: '',
      idRestaurante:  item.idRestaurante,
      idMenu: item.idMenu,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: 1,
      tipo: 'entraSale',
      status: 'ordenado',
      categorias: item.categorias,
      areas: item.areas,
      nota: '',
      cAdicional: 0,
      total: item.precio,
      /* fecha,
      anio: this.tls.getYear(fecha),
      mes: this.tls.getMonth(fecha),
      dia: this.tls.getDay(fecha),
      hora: this.tls.getHours(fecha),
      minuto: this.tls.getMinutes(fecha) */
    };

    itemProd = ITEMPROD;
    delete itemProd.id;

    this.ticketProductosArr.push(itemProd);

    /* S e agrega a este arreglo para insertarlo en el ticket */
    this.idProductosArr.push( item.idMenu );

    this.abreModalFoot( itemProd, this.ticketProductosArr.length - 1 );

  }

  abreModalFoot( item: TicketProductoModel, i: number ){

    $('#modal1').modal('open');

    /* Estas dos luneas son necesarias ya que sin ellas el modal se sobrepone al Select de AngularMaterial */
    $('.modal-overlay')[0].style.zIndex = '999';
    $('.modal')[0].style.zIndex = ' 1000';

    this.cantidadM = item.cantidad;
    this.tipoM = item.tipo;

    this.prodTemp = item;
    this.posicionTemp = i;

  }

  changeTipo( event ){

    this.tipoM = event;

  }

  cambiaCantidadTipo(){

    const prod = this.prodTemp;

    prod.cantidad = this.cantidadM;
    prod.total = prod.cantidad * prod.precio;
    prod.tipo = this.tipoM;

    this.ticketProductosArr.splice( this.posicionTemp, 1, prod);
  }

  cantMenos(){

    if ( this.cantidadM === 1){
      Swal.fire({
        icon: 'info',
        title: 'Advertencia',
        text: 'No puede agregar menos de 1!'
      });
      return;
    }

    this.cantidadM --;

  }

  cantMas(){

    this.cantidadM ++;

  }

  cambiaTextInput( event ){

    this.cantidadM = event.target.value;

  }


  onKeyUp( event ){

    this.textSearch = event.target.value;

    const busqueda = event.target.value.toLowerCase();

    $('#tableMenu tbody tr').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(busqueda) > -1);
    });

  }

  limpiaText(){
    this.textSearch = '';
  }

  inicailizaMaterialize(){

    $('#modal1').modal();
    $('.tooltipped').tooltip();
    $('select').formSelect();

  }



}
