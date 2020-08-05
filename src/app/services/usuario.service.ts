import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';

import {RegisterForm} from '../interfaces/register-form.interface';
import {LoginForm} from '../interfaces/login-form.interface';
import {CargarUsuario} from '../interfaces/cargar-usuarios.interface';

import {Usuario} from '../models/usuario.model';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  googleInit() {
    return new Promise(resolve => {
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '854771099296-89tm3iv9s3celjh0kvrfjqona62ngahf.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });
  }

  guardarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((response: any) => {
        const {nombre, email, img = '', google, role, uid} = response.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        this.guardarLocalStorage(response.token, response.menu);
        return true;
      }),
      // El of me permite crear un observable en base al valor que pongamos
      catchError(() => of(false))
    );
  }

  crearUsuario(formData: RegisterForm): Observable<any> {
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap(response => {
          this.guardarLocalStorage(response.token, response.menu);
        })
      );
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string }) {

    data = {
      ...data,
      role: this.usuario.role
    };
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm): Observable<any> {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap(response => {
        this.guardarLocalStorage(response.token, response.menu);
      })
    );
  }

  loginGoogle(token): Observable<any> {
    return this.http.post(`${base_url}/login/google`, {token}).pipe(
      tap(response => {
        this.guardarLocalStorage(response.token, response.menu);
      })
    );
  }

  cargarUsuarios(desde: number = 0): Observable<any> {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        map(response => {
          const usuarios = response.usuarios
            // Creamos un arreglo de usuarios para poder usar sus instancias mas adelante
            .map(user => new Usuario(
              user.nombre, user.email, '', user.img, user.google, user.role, user.uid));
          return {
            totalRegistros: response.totalRegistros,
            usuarios
          };
        })
      );
  }

  eliminarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario) {
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }
}
