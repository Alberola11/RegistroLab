import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {Usuarios} from "../../models/Usuarios";

@Component({
  selector: 'app-navbar-loggeado',
  templateUrl: './navbar-loggeado.component.html',
  styleUrls: ['./navbar-loggeado.component.scss']
})
export class NavbarLoggeadoComponent implements OnInit{

   public  usuarioGoogle= this.userService.getCurrentUser();
   public  usuario: Usuarios | undefined;
   public  Usuuarios= this.userService.getPlaces();
  users: Usuarios[]= [];


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
  }




  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(error => console.log(error));
  }


}
