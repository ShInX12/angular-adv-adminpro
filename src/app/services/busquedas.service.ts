import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Usuario} from '../models/usuario.model';
import {Hospital} from '../models/hospital.model';
import {Medico} from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

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

  transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(
        user.nombre, user.email, '', user.img, user.google, user.role, user.uid));

  }

  transformarHospitales(resultados: any[]): Hospital[] {
    return resultados;
  }

  transformarMedicos(resultados: any): Medico[] {
    return resultados;
  }

  busquedaGlobal(termino: string) {
    const url = `${base_url}/todo/${termino}`;
    return this.http.get(url, this.headers);
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string): Observable<any> {

    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;

    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map((response: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(response.resultados);
            case 'hospitales':
              return this.transformarHospitales(response.resultados);
            case 'medicos':
              return this.transformarMedicos(response.resultados);
            default:
              return [];
          }
        })
      );
  }


}
