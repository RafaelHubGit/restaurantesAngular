import { Component, OnInit } from '@angular/core';

import { TicketDatosModel } from '../../models/ticketDatos.model';


import { TicketService } from '../../services/ticket.service';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  ticketsArr: TicketDatosModel[] = [];

  constructor( private sT: TicketService ) { }

  ngOnInit(): void {

    this.getTickets();

  }

  getTickets(){

    this.sT.getTickets()
          .subscribe( resp => {
            
            this.ticketsArr = [];
            let ticket: any;

            resp.forEach( doc => {
              ticket = doc.payload.doc.data();

              const TICKETTEMP = {
                ...ticket,
                id: doc.payload.doc.id
              }

              this.ticketsArr.push( TICKETTEMP );

            });

          });

          

  }

}
