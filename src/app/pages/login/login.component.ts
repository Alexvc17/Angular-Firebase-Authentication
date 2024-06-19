import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.models';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usuario: UsuarioModel = new UsuarioModel;
  recordarUsuario: boolean = false;

  constructor(private auth: AuthService,
              private router: Router){}

  ngOnInit(): void {

    if(localStorage.getItem('email')){
      this.usuario.email = localStorage.getItem('email')!;
    }

  }

  login(form: NgForm){

    if (form.invalid){return;}

    Swal.fire({
      //evitar que cierre la alerta si hace click afuera
      allowOutsideClick: false,
      icon: 'info',
      title: 'Cargando',
      text: 'Espere porfavor ...',
      showConfirmButton: false

    });
    Swal.showLoading(Swal.getDenyButton());
    //aqui me subscribo para que me de respuesta de los datos


    this.auth.login(this.usuario).subscribe({
      next: (resp) => {
        //cuando obtengo respuesta se cierra el sweet alert
        Swal.close();
        //si esta checkeado guarda el email en el local storage
        if(this.recordarUsuario){
          localStorage.setItem('email', this.usuario.email);
        }
        //router se implementara cuando se que tengo una autenticacion valida
        this.router.navigateByUrl("/home");
      },
      error: (err) => {
//        window.alert(err.error.error.message);
        Swal.fire({
          //evitar que cierre la alerta si hace click afuera
          allowOutsideClick: false,
          title: 'Error de Autenticacion',
          icon: 'error',
          text: err.error.error.message,


        });
      }
    });

  }
}
