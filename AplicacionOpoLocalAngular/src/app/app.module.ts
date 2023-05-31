import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {environment} from "../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import { HomeComponent } from './componentes/SinLogin/home/home.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import {MatChipsModule} from "@angular/material/chips";
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import {MainComponent} from "./componentes/ConLogin/main/main.component";
import {RegisterComponent} from "./componentes/SinLogin/register/register.component";
import {LoginComponent} from "./componentes/SinLogin/login/login.component";
import { provideAuth,getAuth } from '@angular/fire/auth';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import { NavbarLoggeadoComponent } from './layout/navbar-loggeado/navbar-loggeado.component';
import { FooterLoggeadoComponent } from './layout/footer-loggeado/footer-loggeado.component';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import { ListadoHorasUsuarioComponent } from './componentes/ConLogin/listado-horas-usuario/listado-horas-usuario.component';
import { OrderModule } from 'ngx-order-pipe';
import { provideStorage,getStorage } from '@angular/fire/storage';
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import { PerfilComponent } from './componentes/ConLogin/perfil/perfil.component';
import { RecuperarContrasenyaComponent } from './componentes/SinLogin/recuperar-contrasenya/recuperar-contrasenya.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatPaginatorModule} from "@angular/material/paginator";
import { CalendarioComponent } from './componentes/ConLogin/calendario/calendario.component';
import {FullCalendarModule} from "@fullcalendar/angular";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    MainComponent,
    RegisterComponent,
    LoginComponent,
    NavbarLoggeadoComponent,
    FooterLoggeadoComponent,
    ListadoHorasUsuarioComponent,
    PerfilComponent,
    RecuperarContrasenyaComponent,
    CalendarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFirestoreModule,
    MatChipsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    OrderModule,
    AngularFireStorageModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    FullCalendarModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
