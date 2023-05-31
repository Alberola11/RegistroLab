import {Component, OnInit, ViewChild} from '@angular/core';
import {Usuarios} from "../../../models/Usuarios";
import {EntradaSalida} from "../../../models/entradaSalida";
import {UserService} from "../../../service/user.service";
import {Router} from "@angular/router";
import {Storage} from "@angular/fire/storage";
import {Firestore} from "@angular/fire/firestore";
import {finalize} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";


@Component({
  selector: 'app-listado-horas-usuario',
  templateUrl: './listado-horas-usuario.component.html',
  styleUrls: ['./listado-horas-usuario.component.scss']
})
export class ListadoHorasUsuarioComponent implements OnInit{
  entradasSalidas: EntradaSalida[]=[];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<EntradaSalida>(this.entradasSalidas);
  displayedColumns: string[] = ['Fecha completa', 'Tipo', 'Subir archivo'];



  entradaRegistrada = false;
  public  usuarioGoogle= this.userService.getCurrentUser();
  public  usuario: Usuarios | undefined;
  public  Usuuarios= this.userService.getPlaces();
  public users: Usuarios[]= [];

  contador: number=0;



  entrada: EntradaSalida = { fechaHora: new Date(), tipo: 'entrada', uid:'' , registro:0};
  salida: EntradaSalida = { fechaHora: new Date(), tipo: 'salida', uid:'', registro:0};


  constructor(
    private userService: UserService,
    private router: Router,
    private storage: Storage,
    private storage2: AngularFireStorage,
    private firestore: AngularFirestore,

    private  firestoreAuth: Firestore
  ) {

  }

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
      this.entradasSalidas = entradasSalidas.sort((a, b) => {
        if (a.registro < b.registro) {
          return -1;
        } else if (a.registro > b.registro) {
          return 1;
        } else {
          return 0;
        }
      });

      console.log(this.entradasSalidas);

      this.dataSource.data = this.entradasSalidas; // set the data for the dataSource
      this.dataSource.paginator = this.paginator;
    });
  }


  fechaHoraToString(fechaHora: any): string {
    if (fechaHora && fechaHora.seconds && fechaHora.nanoseconds) {
      const fecha = new Date(fechaHora.seconds * 1000 + fechaHora.nanoseconds / 1000000);
      return fecha.toLocaleString();
    } else {
      return '';
    }
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


  subirArchivo(event: any, id: string, index: number) {
    const archivo = event.target.files[0];
    const ruta = `archivos/${id}/${archivo.name}`;
    const ref = this.storage2.ref(ruta);

    const metadata = {
      cacheControl: 'public, max-age=31536000'
    };
    const usuario = this.userService.getCurrentUser();
    // Comprobar si el documento ya existe en Firestore

      const docRef = this.firestore.collection('EntradasSalidasTrabajo').doc(usuario?.uid).collection('EntradasSalidas').doc(index.toString());
      docRef.get().toPromise().then(docSnapshot => {
        if (docSnapshot?.exists) { // El documento ya existe
          const tarea = ref.put(archivo, metadata);

          tarea.snapshotChanges().pipe(
            finalize(() => {
              ref.getDownloadURL().subscribe((url) => {
                docRef.update({ archivo: url });
              });
            })
          ).subscribe();
        } else { // El documento no existe
          const tarea = ref.put(archivo, metadata);

          tarea.snapshotChanges().pipe(
            finalize(() => {
              ref.getDownloadURL().subscribe((url) => {
                docRef.set({ archivo: url });
              });
            })
          ).subscribe();
        }
      });

    }




}
