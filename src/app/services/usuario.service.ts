import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';

import {RegisterForm} from '../interfaces/register-form.interface';
import {LoginForm} from '../interfaces/login-form.interface';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {
    this.googleInit();
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

  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      }),
      map(response => true),
      // El of me permite crear un observable en base al valor que pongamos
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm): Observable<any> {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  login(formData: LoginForm): Observable<any> {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  loginGoogle(token): Observable<any> {
    return this.http.post(`${base_url}/login/google`, {token}).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }
}
