import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {UserService} from "../../../service/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {



  constructor(private userService: UserService, private router: Router, private fb:FormBuilder){}

   passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

  formulario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],  //si solo ponemos un validator no hace falta ponerlos en []
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(this.passwordPattern)]], //como el select es multiple lo tenmos que poner en un array vacio
    nombre: ['', Validators.required],
  })
  ngOnInit(): void {
  }

  onSubmit() {
    this.userService.register(this.formulario.value)
      .then(response => {
        console.log(response);
        this.router.navigate(['/home']);
      })
      .catch(error => console.log(error));
  }

}
