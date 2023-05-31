import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./componentes/SinLogin/home/home.component";
import {MainComponent} from "./componentes/ConLogin/main/main.component";
import {canActivate, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {RegisterComponent} from "./componentes/SinLogin/register/register.component";
import {
  ListadoHorasUsuarioComponent
} from "./componentes/ConLogin/listado-horas-usuario/listado-horas-usuario.component";
import {PerfilComponent} from "./componentes/ConLogin/perfil/perfil.component";
import * as path from "path";
import {
  RecuperarContrasenyaComponent
} from "./componentes/SinLogin/recuperar-contrasenya/recuperar-contrasenya.component";
import {CalendarioComponent} from "./componentes/ConLogin/calendario/calendario.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },

  { path: 'register', component: RegisterComponent },
  {path:'home', component: HomeComponent},
  {
    path: 'main',
    component: MainComponent, ...canActivate(() => redirectUnauthorizedTo(['/home']))
  },
  {path:'listado-horas-usuario', component: ListadoHorasUsuarioComponent},
  {path:'perfil', component:PerfilComponent},
  {path:'olvidarContra', component:RecuperarContrasenyaComponent },
  {path:'calendario', component:CalendarioComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
