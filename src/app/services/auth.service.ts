//este servicio manejara toda la parte de la autenticacion de usuario
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.models';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apikey = '';
  userToken!: string;

  //Crear nuevo usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  //inyectamos el servicio
  constructor(private http: HttpClient) {

    //trae el token
    this.leerToken();

  }


  logout(){

    localStorage.removeItem('token');

  }

  login(usuario: UsuarioModel){

       const authData = {
        ...usuario,
        returnSecureToken: true

      };

      return this.http.post(
        `${this.url}/accounts:signInWithPassword?key=${this.apikey}`,
        authData
      ).pipe(
        //el map me transforma la respuesta y se ejecuta si tenemos exito en la peticion si da error este pipie nunca se ejecuta
        map( (resp:any) =>{

          console.log("Entro en el map de rxjs")
          this.guardarToken( resp.idToken );
          //para que map no me bloquee la respuesta le hago un return
          return resp;
        })
      );
  }

  nuevoUsuario(usuario: UsuarioModel){

    //Esta es la informacion que yo debo mandar (payload)
    const authData = {
      ...usuario,
      /* es sinonimo, solo que enviaria tambien el nombre, pero firebase lo ignorara
      email: usuario.email,
      password: usuario.password,*/
      returnSecureToken: true

    };
   //me pide el url seguido del end point lo que sigue v1...
   //y otro argumento que es el payload osea mi authData
   //y paso la peticion http por un pipe
    return this.http.post(
      `${this.url}/accounts:signUp?key=${this.apikey}`,
      authData
    ).pipe(
      //el map me transforma la respuesta y se ejecuta si tenemos exito en la peticion si da error este pipie nunca se ejecuta
      map( (resp:any) =>{

        this.guardarToken(resp.idToken);
        //para que map no me bloquee la respuesta le hago un return
        return resp;
      })
    );
  }



  //metodo para guardar el token
  private guardarToken(idToken: string){

    this.userToken = idToken;
    //llamo al loca storage y lo almaceno en una propiedad llamada token, luego mando el idToken
    localStorage.setItem('token', idToken)

    //hacemos la validacion de la fecha
    let hoy = new Date();
    hoy.setSeconds(3600);

    //guardare en el localstorage la hora exacta de cuando va a expirar el token y la convierto a string
    localStorage.setItem('expira', hoy.getTime().toString());



  }

  //metodo para leer el token
  leerToken(){

    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token')!;
    }else{
      this.userToken = '';
    }
  }


  estaAutenticado(): boolean{

    //verifica si existe un token
    if(this.userToken.length < 2){
      return false;
    };

    //me retorna un string asi que lo convierto a Number
    const expira = Number(localStorage.getItem('expira'));
    //fecha en la cual el token expira
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if(expiraDate > new Date()){
      return true;
    }else{
      //el token expiro
      return false;
    }


  }

}

