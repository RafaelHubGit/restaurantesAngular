

export class TicketProductoModel{

    id: string;
    /* idRestaurante: string; */
    /* idTicket: string; */
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
    /* fecha: Date;
    anio: number;
    mes: number;
    dia: number;
    hora: number;
    minuto: number; */

}

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
