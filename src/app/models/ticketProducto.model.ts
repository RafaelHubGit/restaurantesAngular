
/* este modelo es el detalle de cada producto elegido */
export class TicketProductoModel{

    id: string;
    idMenu: string;
    nombre: string;
    precio: number;
    cantidad: number;
    tipo: string;
    nota: string;
    cAdicional: number;
    categorias: [];
    areas: [];
    total: number;
    status: string;

}

/* Este modelo solo es usado en el detalle general del ticket  */
export class TicketProductoDetalleModel{

    id: string;
    idRestaurante: string;
    idTicket: string;
    productos: TicketProductoModel[];
    fecha: Date;
    anio: number;
    mes: number;
    dia: number;
    hora: number;
    minuto: number;

}


/* Este modelo es el que se agrega como un documento a nivel de todos los demas para que sea mandado a la respectiva area */
export class ProdToAreaModel {

    id: string;
    idRestaurante: string;
    idTicket: string;
    idMenu: string;
    nombre: string;
    precio: number;
    cantidad: number;
    tipo: string;
    nota: string;
    cAdicional: number;
    categorias: any;
    areas: any;
    total: number;
    status: string;
    fecha: Date;
    anio: number;
    mes: number;
    dia: number;
    hora: number;
    minuto: number;

}
