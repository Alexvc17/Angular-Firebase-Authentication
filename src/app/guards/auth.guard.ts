import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private auth: AuthService,
            private router: Router
    ) {
    // Aquí inyectas tu servicio en el constructor
  }



  canActivate: CanActivateFn = (

  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
  ) => {
    Observable<boolean>
    if(this.auth.estaAutenticado()){
      return true;
    }else{
      this.router.navigateByUrl('/login');
      return false;
    }

}

}
