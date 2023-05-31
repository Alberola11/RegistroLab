import {Injectable, OnInit} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider, user,
} from '@angular/fire/auth';

import { PruebaService } from './prueba.service';
import {
  collection,
  collectionData,
  Firestore,
  doc,
  getDoc,
  docData,
  getDocs,
  addDoc,
  setDoc, query, where
} from "@angular/fire/firestore";
import {map, Observable} from "rxjs";
import {Usuarios} from "../models/Usuarios";
import {EntradaSalida} from "../models/entradaSalida";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {orderByValue} from "@angular/fire/database";

@Injectable({
  providedIn: 'root',
})
export class UserService  implements OnInit{

  usuarios: Usuarios[] = [];

  constructor(
    private readonly auth: Auth,
    private readonly prueba: PruebaService,
    private readonly firestoreAuth: Firestore,
    private firestore2: AngularFirestore,

    private afAuth: AngularFireAuth

  ) {
    this.firestore2.collection<Usuarios>('Usuarios').valueChanges().subscribe((data: Usuarios[]) => {
      this.usuarios = data;
      console.log(this.usuarios.length); // Aquí obtienes el número de usuarios en la colección
    });
  }

 async ngOnInit() {

  }

 public  loggeado: boolean=false;
  async register({
                   email,
                   password,
                   nombre,
                 }: {
    email: string;
    password: string;
    nombre:string
  }): Promise<any> {
    // Consulta para verificar si ya existe un usuario con el mismo correo
    const querySnapshot = await getDocs(
      query(collection(this.firestoreAuth, 'usuarios'), where('mail', '==', email))
    );

    // Si la consulta devuelve algún resultado, mostrar un mensaje de error y no permitir el registro
    if (!querySnapshot.empty) {
      throw new Error('Ya existe un usuario con este correo electrónico');
    }

    // Si la consulta no devuelve ningún resultado, proceder con el registro de un nuevo usuario
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    const lastId = this.usuarios.length > 0 ? this.usuarios[this.usuarios.length - 1].id : '0';
    let id= Number(lastId) + 1;
    return await this.prueba.addUser({

      id:id.toString(),
      uid: userCredential.user.uid,
      nombre: nombre,
      mail: email,
      userType: 'USER',
    });
  }

  async addEntradaSalidaTrabajo(entradaSalida: EntradaSalida): Promise<any> {
    const user = this.auth.currentUser;
    if (user) {
      // Obtener el ID de documento del usuario actual
      const userId = user.uid;

      // Crear una referencia a la subcolección "EntradasSalidasTrabajo" dentro del documento del usuario

      // Crear una referencia a la subcolección "EntradasSalidasTrabajo" dentro del documento del usuario
      const userRef = doc(this.firestoreAuth, 'EntradasSalidasTrabajo', userId, 'EntradasSalidas',entradaSalida.registro.toString());
      console.log(userId);
      const entradasSalidasRef = collection(userRef, 'EntradasSalidas');

      // Añadir una nueva entrada/salida a la subcolección
      await setDoc(userRef, entradaSalida);
    } else {
      console.error('No se puede agregar la entrada/salida de trabajo, usuario no autenticado');
    }
  }

  async addSalida(entradaSalida: EntradaSalida): Promise<any> {
    const user = this.auth.currentUser;
    if (user) {
      // Obtener el ID de documento del usuario actual
      const userId = user.uid;

      // Crear una referencia a la subcolección "EntradasSalidasTrabajo" dentro del documento del usuario
      const userRef = doc(this.firestoreAuth, 'EntradasSalidasTrabajo', userId, 'EntradasSalidas',entradaSalida.registro.toString());
      console.log(userId);
      const entradasSalidasRef = collection(userRef, 'EntradasSalidas');

      // Añadir una nueva entrada/salida a la subcolección
      await setDoc(userRef, entradaSalida);
    } else {
      console.error('No se puede agregar la entrada/salida de trabajo, usuario no autenticado');
    }
  }


  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.loggeado = true; // Cambiar la variable booleana a verdadero
      });
  }

  loginWithGoogle() {



    return signInWithPopup(this.auth, new GoogleAuthProvider()).then(() => {
      this.loggeado = true; // Cambiar la variable booleana a verdadero
    });
  }


  logout() {
    this.loggeado=false;
    return signOut(this.auth).then(() => {
      this.loggeado = false; // Cambiar la variable booleana a verdadero
    });
  }

  getCurrentUser() {
    const user = this.auth.currentUser;
    if (user) {
      // El usuario está autenticado
      const { uid, email, displayName, photoURL} = user;
      return { uid, email, displayName, photoURL  };
    } else {
      // El usuario no está autenticado
      return null;
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log('Error al enviar el correo electrónico para restablecer la contraseña', error);
    }
  }

  getentradas(): Observable<EntradaSalida[]> |null {
    const user=this.auth.currentUser;
    if (!user) {
      // Usuario no autenticado o no se ha obtenido uid
      return null;
    }
    const userRef = collection(this.firestoreAuth, 'EntradasSalidasTrabajo', user?.uid, 'EntradasSalidas');
    return collectionData(userRef) as Observable<EntradaSalida[]>;
  }

  getSalidas(): Observable<EntradaSalida[]> |null {
    const user=this.auth.currentUser;
    if (!user) {
      // Usuario no autenticado o no se ha obtenido uid
      return null;
    }
    const userRef = collection(this.firestoreAuth, 'EntradasSalidasTrabajo', user?.uid, 'Salidas');
    userRef.converter
    return collectionData(userRef) as Observable<EntradaSalida[]>;
  }


  getUsuarios(): Observable<Usuarios[]> {
    const user = this.auth.currentUser;
    const userId = user?.uid;
    const userRef = collection(this.firestoreAuth, 'Usuarios');
    return collectionData(userRef, { idField: 'id' }) as Observable<Usuarios[]>;
  }

  getUsuario(): Observable<Usuarios> | null {
    const user = this.auth.currentUser;
    const userId = user?.uid;
    if (!userId) {
      // Usuario no autenticado o no se ha obtenido uid
      return null;
    }
    const userRef = doc(this.firestoreAuth, 'Usuarios', userId);
    return docData(userRef) as Observable<Usuarios>;
  }



  getPlaces(): Observable<Usuarios[]> {
    const userRef = collection(this.firestoreAuth, 'Usuarios');
    return collectionData(userRef, { idField: 'id' }) as Observable<Usuarios[]>;
  }




}
