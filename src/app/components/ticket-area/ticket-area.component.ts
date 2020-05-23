import { Component, OnInit } from '@angular/core';
import { GettersService } from '../../services/getters.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TicketAreaService } from '../../services/ticket-area.service';
import { ProdToAreaModel } from '../../models/ticketProducto.model';

@Component({
  selector: 'app-ticket-area',
  templateUrl: './ticket-area.component.html',
  styleUrls: ['./ticket-area.component.css']
})
export class TicketAreaComponent implements OnInit {

  idArea: string;
  opciones: any;
  opcionesValue =  ['entraSale', 'tiempo1', 'tiempo2', 'postre'];
  opcionesFormControl = new FormControl();
  areaProdsArr: ProdToAreaModel[] = [];
  entraSaleArr: ProdToAreaModel[] = [];
  tiempo1Arr: ProdToAreaModel[] = [];
  tiempo2Arr: ProdToAreaModel[] = [];
  postreArr: ProdToAreaModel[] = [];


  constructor( private getS: GettersService,
               private route: ActivatedRoute,
               private taS: TicketAreaService ) {

    this.idArea = this.route.snapshot.paramMap.get('idArea');
    this.opciones = this.getS.dataTipo.tipo;
    this.getProdArea();

  }

  ngOnInit(): void {

    this.inicializaDatosSelect();

  }

  getProdArea(){

    this.taS.getProdArea( this.idArea )
            .subscribe( resp => {

              let tempItem: any;
              const itemArr = [];

              resp.forEach( doc => {
                tempItem = doc.payload.doc.data();

                const ITEMTEMP = {
                  ...tempItem,
                  id: doc.payload.doc.id
                };

                itemArr.push( ITEMTEMP );

              });
              this.areaProdsArr = itemArr;

              this.entraSaleArr = this.filtraTipo( this.areaProdsArr, 'entraSale' );
              this.tiempo1Arr = this.filtraTipo( this.areaProdsArr, 'tiempo1' );
              this.tiempo2Arr = this.filtraTipo( this.areaProdsArr, 'tiempo2' );
              this.postreArr = this.filtraTipo( this.areaProdsArr, 'postre' );

              this.resizeGridColumns();

    });

  }

  filtraTipo( array: ProdToAreaModel[], tipo: string) {


    const tipoArr = array.filter( item => item.tipo === tipo );
    return tipoArr.sort().reverse();

  }


  inicializaDatosSelect(){

    this.opcionesFormControl.setValue( this.opcionesValue );

  }

  changeOption( event ){

    const SELECTED = event;

    /* esto redimenciona la grid dependiendo de la cantidad de opciones elegidas */
    document.getElementById('middleContainer').style.gridTemplateColumns = `repeat(${event.length}, 1fr)`;

    /* pone o quita los divs */
    this.opcionesValue.forEach( item => {

      const result = SELECTED.filter( thisItem => thisItem === item );

      if ( result.length !== 0 ){
        document.getElementById(`${ item }`).style.display = 'block';
      } else {
        document.getElementById(`${ item }`).style.display = 'none';
      }

    });
  }

  resizeGridColumns(){

    this.opcionesValue = [];

    if ( this.entraSaleArr.length !== 0 ) {
      this.opcionesValue.push('entraSale');
    }
    if ( this.tiempo1Arr.length !== 0 ){
      this.opcionesValue.push('tiempo1');
    }
    if ( this.tiempo2Arr.length !== 0 ){
      this.opcionesValue.push('tiempo2');
    }
    if ( this.postreArr.length !== 0 ){
      this.opcionesValue.push('postre');
    }

    this.opcionesFormControl.setValue( this.opcionesValue );
    const CANTIDAD = this.opcionesValue.length;
    document.getElementById('middleContainer').style.gridTemplateColumns = `repeat(${CANTIDAD}, 1fr)`;

  }

}
