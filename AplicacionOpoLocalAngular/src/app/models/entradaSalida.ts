export interface EntradaSalida {

  fechaHora: Date;
  tipo: 'entrada' | 'salida';
  uid: string;
  registro: number;

  archivo?:string;

}
