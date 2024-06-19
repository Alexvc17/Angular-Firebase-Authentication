import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.models';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  //Crearemos una nueva instancia de mi usuario model
  usuario: UsuarioModel = new UsuarioModel;
  recordarUsuario: boolean = false;

  constructor(private auth: AuthService,
              private router: Router
    ){ }






  onSubmmit(form: NgForm){

    if (form.invalid){
      return;
    }

    Swal.fire({
      //evitar que cierre la alerta si hace click afuera
      allowOutsideClick: false,
      icon: 'info',
      title: 'Cargando',
      text: 'Espere porfavor ...',
      showConfirmButton: false
    });
    Swal.showLoading(Swal.getDenyButton());



    //al subscribirme recibire informacion de return de authData
    this.auth.nuevoUsuario(this.usuario).subscribe({
      next: (resp) => {
        Swal.close();
        Swal.fire({

          icon: 'success',
          title: 'Usuario registrado con exito',
          showConfirmButton: false,
          timer: 1500
        })

        //para que se grabe si le di check en registrar usuario
        if(this.recordarUsuario){
          localStorage.setItem('email', this.usuario.email);
        }

        //router se implementara cuando se que tengo una autenticacion valida
        this.router.navigateByUrl("/home");
      },
      error: (err) => {


        Swal.fire({
          //evitar que cierre la alerta si hace click afuera
          allowOutsideClick: false,
          title: 'Error al Autenticar',
          icon: 'error',
          text: err.error.error.message,
        });

      }
    });
  }
}
