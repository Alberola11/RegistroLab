import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../service/user.service";
import {Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {Usuarios} from "../../../models/Usuarios";
import {finalize} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {collection, doc, Firestore, getDocs, query, updateDoc, where} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";


import 'firebase/auth';
import 'firebase/firestore';
import firebase from "firebase/compat";
import {
  Auth,
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  updateProfile, verifyBeforeUpdateEmail
} from "@angular/fire/auth";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit{

  public  usuarioGoogle= this.userService.getCurrentUser();
  public  usuarioAutentificado: Usuarios | undefined;

  users: Usuarios[]= [];


  constructor(private userService: UserService, private router: Router, private fb:FormBuilder,

              private storage2: AngularFireStorage,
              private firestore: AngularFirestore,
              private readonly auth: Auth,

              private  firestoreAuth: Firestore,
              private afAuth: AngularFireAuth
              ){

  }

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

  formulario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],  //si solo ponemos un validator no hace falta ponerlos en []
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(this.passwordPattern)]], //como el select es multiple lo tenmos que poner en un array vacio
    nombre: ['', Validators.required],
  })
  ngOnInit(): void {
    this.userService.getPlaces().subscribe(users => {

      this.users = users;

      // Encuentra el usuario que coincide con el usuario autenticado
      const user = this.users.find(u => u.uid === this.usuarioGoogle?.uid);
      if (user) {
        console.log('Usuario encontrado:', user);
        // Hacer algo con el usuario encontrado
        this.usuarioAutentificado=user;
      } else {
        console.log('Usuario no encontrado');
      }
    });
  }


  subirArchivo(event: any) {
    const fotoPerfil = event.target.files[0];
    const ruta = `archivos/${fotoPerfil.name}`;
    const ref = this.storage2.ref(ruta);

    const metadata = {
      cacheControl: 'public, max-age=31536000'
    };
    const usuario = this.userService.getCurrentUser();
    // Comprobar si el documento ya existe en Firestore

    const docRef = this.firestore.collection('Usuarios').doc(this.usuarioAutentificado?.id);

    docRef.get().toPromise().then(docSnapshot => {
      if (docSnapshot?.exists) { // El documento ya existe
        const tarea = ref.put(fotoPerfil, metadata);

        tarea.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe((url) => {
              docRef.update({ fotoPerfil: url });
            });
          })
        ).subscribe();
      } else { // El documento no existe
        const tarea = ref.put(fotoPerfil, metadata);

        tarea.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe((url) => {
              docRef.set({ fotoPerfil: url });
            });
          })
        ).subscribe();
      }
    });
  }

  async actualizarEmail() {


    const email = this.formulario.value.email;

    const nombre = this.formulario.value.nombre;

    const auth = getAuth();
    const user = auth.currentUser;

    if (user)
      updateEmail(user, email)
        .then(() => console.log('E-mail actualizada correctamente'))
        .catch((error) => console.log('Error al actualizar el e-mail', error));

    const querySnapshot = await getDocs(
      query(collection(this.firestoreAuth, 'Usuarios'), where('mail', '==', email))
    );

    // Si la consulta devuelve algún resultado, mostrar un mensaje de error y no permitir el registro
    if (!querySnapshot.empty) {
      throw new Error('Ya existe un usuario con este correo electrónico');
    }else {
      const docRef =  await this.firestore.collection('Usuarios').doc(this.usuarioAutentificado?.id);
      await docRef.update({
        mail: email
      });
    }



  }

  actualizarNombre() {
    const email = this.formulario.value.email;
    const password = this.formulario.value.password;
    const nombre = this.formulario.value.nombre;

    const auth = getAuth();
    const user = auth.currentUser;
    if (user)
      updateProfile(user, {
        displayName: nombre
      })
        .then(() => console.log('Nombre actualizado correctamente'))
        .catch((error) => console.log('Error al actualizar el nombre', error));

    const docRef = this.firestore.collection('Usuarios').doc(this.usuarioAutentificado?.id);
    docRef.update({
      nombre: nombre
    });

  }
  actualizarContra() {

    const password = this.formulario.value.password;
    const nombre = this.formulario.value.nombre;

    const auth = getAuth();
    const user = auth.currentUser;
    if (user)
      updatePassword(user, password)
        .then(() => console.log('Contraseña actualizada correctamente'))
        .catch((error) => console.log('Error al actualizar la contraseña', error));




  }
}
