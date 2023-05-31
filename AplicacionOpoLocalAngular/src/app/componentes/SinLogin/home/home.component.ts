import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Usuarios} from "../../../models/Usuarios";
import {PruebaService} from "../../../service/prueba.service";
import {UserService} from "../../../service/user.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {RecuperarContrasenyaComponent} from "../recuperar-contrasenya/recuperar-contrasenya.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('passwordInput', {static: false}) passwordInput!: ElementRef;
  @ViewChild('passwordIcon', {static: false}) passwordIcon!: ElementRef;

  togglePasswordVisibility() {
    if (this.passwordInput.nativeElement.type === 'password') {
      this.passwordInput.nativeElement.type = 'text';
      this.passwordIcon.nativeElement.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
      this.passwordInput.nativeElement.type = 'password';
      this.passwordIcon.nativeElement.innerHTML = '<i class="fas fa-eye"></i>';
    }
  }


  users: Usuarios[]= [];
  user: any;
  formLogin: FormGroup;


  constructor(private pruebaService: PruebaService,private userService: UserService, private router: Router, private fb:FormBuilder, private dialog:MatDialog) {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }
  ngOnInit(): void {
    this.pruebaService.getPlaces().subscribe(users => {
      console.log(users)
      this.users=users;
    })
  }

  onSubmit() {
    this.userService
      .login(this.formLogin.value)
      .then((response) => {
        this.user = response;
        console.log(response);
        this.router.navigate(['/main']);
      })
      .catch((error) => console.log(error));
  }

  onClick() {
    this.userService
      .loginWithGoogle()
      .then((response) => {
        console.log(response);
        this.router.navigate(['/main']);
      })
      .catch((error) => console.log(error));
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }


  async resetPassword(email: string): Promise<void> {
    try {
      await this.userService.sendPasswordResetEmail(email);
      console.log('Correo electrónico enviado correctamente para restablecer la contraseña');
    } catch (error) {
      console.log('Error al enviar el correo electrónico para restablecer la contraseña', error);
    }
  }

 public openDialog() {
    this.dialog.open(RecuperarContrasenyaComponent,{
      disableClose:true,
      width:'300px',
      height:'200px'
    });


  }
  public closeDialog() {
    this.dialog.closeAll();
  }

}
