import { Component, OnInit, Input } from '@angular/core';
import { ProdToAreaModel } from '../../models/ticketProducto.model';

@Component({
  selector: 'app-table-ticket-area',
  templateUrl: './table-ticket-area.component.html',
  styleUrls: ['./table-ticket-area.component.css']
})
export class TableTicketAreaComponent implements OnInit {

  @Input() dataTable: ProdToAreaModel[] = [];
  @Input() titulo: string;

  constructor() {

  }

  ngOnInit(): void {

    

  }

}
