import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route, UrlSegment} from '@angular/router';
import {UsuarioService} from '../services/usuario.service';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private usuarioService: UsuarioService,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    return this.usuarioService.validarToken()
      .pipe(
        tap(estaAutenticado => {
          if (!estaAutenticado){
            this.router.navigateByUrl('/login');
          }
        })
      );
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Debe retornar una promesa que resulva true o false
    return this.usuarioService.validarToken()
      .pipe(
        tap(estaAutenticado => {
          if (!estaAutenticado){
            this.router.navigateByUrl('/login');
          }
        })
      );
  }

}
