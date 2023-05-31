import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from "../../../service/user.service";
import {Usuarios} from "../../../models/Usuarios";
import {EntradaSalida} from "../../../models/entradaSalida";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {


  entradaRegistrada = false;
  public  usuarioGoogle= this.userService.getCurrentUser();
  public  usuario: Usuarios | undefined;
  public  Usuuarios= this.userService.getPlaces();
  users: Usuarios[]= [];

  entradasSalidas: EntradaSalida[]=[];
  contador: number=0;
  entrada: EntradaSalida = { fechaHora: new Date(), tipo: 'entrada', uid:'' , registro:0};
  salida: EntradaSalida = { fechaHora: new Date(), tipo: 'salida', uid:'', registro:0};


  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.userService.getPlaces().subscribe(users => {

      this.users = users;

      // Encuentra el usuario que coincide con el usuario autenticado
      const user = this.users.find(u => u.uid === this.usuarioGoogle?.uid);
      if (user) {
        console.log('Usuario encontrado:', user);
        // Hacer algo con el usuario encontrado
        this.usuario=user;
      } else {
        console.log('Usuario no encontrado');
      }
    });

    this.userService.getentradas()?.subscribe(entradasSalidas => {
      this.entradasSalidas=entradasSalidas;
      console.log(entradasSalidas)
    })

  }

  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(error => console.log(error));
  }


  fechaHoraToDate(fechaHora: any): { fecha: Date, hora: Date } {
    if (fechaHora && fechaHora.seconds && fechaHora.nanoseconds) {
      const fecha = new Date(fechaHora.seconds * 1000 + fechaHora.nanoseconds / 1000000);
      const hora = new Date(fechaHora.seconds * 1000 + fechaHora.nanoseconds / 1000000);
      hora.setHours(0, 0, 0, 0);
      return { fecha, hora };
    } else {
      return { fecha: new Date(), hora: new Date() };
    }
  }

  registrarEntrada() {
    // Comprobar que el usuario está autenticado
    if (this.usuario) {

        this.contador=this.entradasSalidas.length;

      // Añadir la entrada/salida del trabajo para el usuario actual
      this.userService.addEntradaSalidaTrabajo({
        fechaHora: this.entrada.fechaHora,
        tipo: this.entrada.tipo,
        uid: this.contador.toString(),
        registro:this.contador
      }).then(() => {
        console.log('Entrada/salida registrada correctamente');
      }).catch(error => {
        console.error('Error al registrar la entrada/salida', error);
      });
    } else {
      console.error('No se puede registrar la entrada/salida, usuario no autenticado');
    }
  }
  registrarSalida() {
    // Comprobar que el usuario está autenticado
    if (this.usuario) {


        this.contador=this.entradasSalidas.length;

      // Añadir la entrada/salida del trabajo para el usuario actual
      this.userService.addSalida({
        fechaHora: this.salida.fechaHora,
        tipo: this.salida.tipo,
        uid: this.contador.toString(),
        registro:this.contador
      }).then(() => {
        console.log('Entrada/salida registrada correctamente');
      }).catch(error => {
        console.error('Error al registrar la entrada/salida', error);
      });
    } else {
      console.error('No se puede registrar la entrada/salida, usuario no autenticado');
    }
  }

  registrarEntradaBoton() {
    if (!this.entradaRegistrada) {
      // Aquí registras la salida en la base de datos
      // Una vez se haya registrado, cambias la variable de control a false:
      this.entradaRegistrada = true;
    } else {
      // Aquí lanzas el mensaje emergente
      alert("Debes registrar una salida antes de volver a registrar una entrada");
    }
    this.registrarEntrada()
  }

  registrarSalidaBoton() {
    if (this.entradaRegistrada) {
      // Aquí registras la salida en la base de datos
      // Una vez se haya registrado, cambias la variable de control a false:
      this.entradaRegistrada = false;
    } else {
      // Aquí lanzas el mensaje emergente
      alert("Debes registrar una entrada antes de registrar una salida");
    }
    this.registrarSalida()
  }





}
