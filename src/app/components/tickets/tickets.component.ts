import { Component, OnInit } from '@angular/core';

import { TicketDatosModel } from '../../models/ticketDatos.model';


import { TicketService } from '../../services/ticket.service';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  ticketsArr: TicketDatosModel[] = [];

  constructor( private sT: TicketService,
               private router: Router ) { }

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

  editaTicket( ticket: TicketDatosModel ){

    this.router.navigate([`/home/ticket/${ ticket.id }`]);

  }

}
