import {Injectable, OnInit} from '@angular/core';
import {
  collection,
  Firestore,
  addDoc,
  collectionData, doc, setDoc, getDocs, getFirestore,
} from '@angular/fire/firestore';
import { Usuarios } from '../models/Usuarios';
import {map, Observable} from 'rxjs';
import {get} from "@angular/fire/database";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root',
})
export class PruebaService implements OnInit{


  usuarios: Usuarios[] = [];

  constructor(private readonly firestore: Firestore,
              private firestore2: AngularFirestore,
  ) {
    this.firestore2.collection<Usuarios>('Usuarios').valueChanges().subscribe((data: Usuarios[]) => {
      this.usuarios = data;
      console.log(this.usuarios.length); // Aquí obtienes el número de usuarios en la colección
    });
  }

  async ngOnInit() {


  }
  addUser(user: Usuarios) {

    const lastId = this.usuarios.length > 0 ? this.usuarios[this.usuarios.length - 1].id : '0';
    let id= Number(lastId) + 1;
    const userRef = doc(this.firestore, 'Usuarios', id.toString());
    return setDoc(userRef, user);
  }

  getPlaces(): Observable<Usuarios[]> {
    const userRef = collection(this.firestore, 'Usuarios');
    return collectionData(userRef, { idField: 'id' }) as Observable<Usuarios[]>;
  }




}
