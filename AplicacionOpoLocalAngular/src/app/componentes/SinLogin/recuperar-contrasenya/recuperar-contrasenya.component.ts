import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../../service/user.service";
import {Router} from "@angular/router";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Auth, getAuth, updateEmail} from "@angular/fire/auth";
import {collection, Firestore, getDocs, query, where} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Usuarios} from "../../../models/Usuarios";
import {MatDialog} from "@angular/material/dialog";
import {el} from "@fullcalendar/core/internal-common";

@Component({
  selector: 'app-recuperar-contrasenya',
  templateUrl: './recuperar-contrasenya.component.html',
  styleUrls: ['./recuperar-contrasenya.component.scss']
})
export class RecuperarContrasenyaComponent {
  cerrarDialogo = true;

  mostrarmensajenoemail=true;
  public  usuarioGoogle= this.userService.getCurrentUser();
  public  usuarioAutentificado: Usuarios | undefined;

  users: Usuarios[]= [];

  formulario = this.fb.group({
    email: ['', [Validators.required, Validators.email]]

  })
  constructor(private userService: UserService, private router: Router, private fb:FormBuilder,

              private dialog: MatDialog,

              private afAuth: AngularFireAuth,
              private  firestoreAuth: Firestore,

  ){

  }

  async actualizarEmail(): Promise<boolean> {


    const email = this.formulario.value.email;



    const querySnapshot = await getDocs(
      query(collection(this.firestoreAuth, 'Usuarios'), where('mail', '==', email))
    );

    // Si la consulta devuelve algún resultado, mostrar un mensaje de error y no permitir el registro
    if (!querySnapshot.empty) {
      console.log('Existe un correo asi')
      this.cerrarDialogo = true;
      this.mostrarmensajenoemail=true;
      return true;


    }else {
      this.cerrarDialogo = false;
      this.mostrarmensajenoemail=false;
      return false;

    }



  }
  async onClickAceptar() : Promise<boolean>{
    if (await this.actualizarEmail()) {
      await this.resetPassword()
      this.dialog.closeAll();

      return true
    }else {
      this.mostrarmensajenoemail=false;
      return false
    }
  }

  async resetPassword() {
    try {
      const email = this.formulario.value.email;
      await this.afAuth.sendPasswordResetEmail(email);
      console.log('Correo enviado');
    } catch (error) {
      console.log('Error al enviar el correo', error);
    }
  }
}
