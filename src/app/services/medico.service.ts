import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Hospital} from '../models/hospital.model';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Medico} from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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

  cargarMedicos(): Observable<any> {
    const url = `${base_url}/medicos`;
    return this.http.get(url, this.headers)
      .pipe(
        map((response: { ok: boolean, medicos: Medico[] }) => response.medicos)
      );
  }

  obtenerMedicoPorId(id: string) {
    const url = `${base_url}/medicos/${id}`;
    return this.http.get(url, this.headers)
      .pipe(
        map((response: { ok: boolean, medico: Medico }) => response.medico)
      );
  }

  crearMedico(medico: { nombre: string, hospital: string }): Observable<any> {
    const url = `${base_url}/medicos`;
    return this.http.post(url, medico, this.headers);
  }

  actualizarMedico(medico: Medico): Observable<any> {
    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.headers);
  }

  borrarMedico(_id: string): Observable<any> {
    const url = `${base_url}/medicos/${_id}`;
    return this.http.delete(url, this.headers);
  }
}

