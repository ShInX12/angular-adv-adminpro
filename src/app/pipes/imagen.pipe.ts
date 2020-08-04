import {Pipe, PipeTransform} from '@angular/core';
import {environment} from '../../environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(imagen: string, tipo: 'usuarios' | 'medicos' | 'hospitales'): string {

    if (!imagen) {
      return `${base_url}/upload/usuarios/no-image`;
    } else if (imagen.includes('https')) {
      return imagen;
    } else if (imagen) {
      return `${base_url}/upload/${tipo}/${imagen}`;
    } else {
      return `${base_url}/upload/usuarios/no-image`;
    }

  }

}
