import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CargarUsuario} from '../interfaces/cargar-usuarios.interface';
import {map} from 'rxjs/operators';
import {Usuario} from '../models/usuario.model';
import {environment} from '../../environments/environment';
import {Hospital} from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) {
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  cargarHospitales(): Observable<any> {
    const url = `${base_url}/hospitales`;
    return this.http.get(url, this.headers)
      .pipe(
        map((response: { ok: boolean, hospitales: Hospital[] }) => response.hospitales)
      );
  }

  crearHospital(nombre: string): Observable<any> {
    const url = `${base_url}/hospitales`;
    return this.http.post(url, {nombre}, this.headers);
  }

  actualizarHospital(_id: string, nombre: string): Observable<any> {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.put(url, {nombre}, this.headers);
  }

  borrarHospital(_id: string): Observable<any> {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.delete(url, this.headers);
  }

}
