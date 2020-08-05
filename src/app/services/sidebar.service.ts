import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu = [];

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')) || [];

    // if (this.menu.length === 0){
    //  Si algo sale mal se saca al usuario de la app porque no cargó bien
    // }
  };

  // menu: any[] = [
  //   {
  //     titulo: 'Principal',
  //     icono: 'mdi mdi-gauge',
  //     submenu:[
  //       {titulo: 'Main', url: '/'},
  //       {titulo: 'ProgressBar', url: 'progress'},
  //       {titulo: 'Gráficas', url: 'grafica1'},
  //       {titulo: 'Promesas', url: 'promesas'},
  //       {titulo: 'Rxjs', url: 'rxjs'},
  //     ]
  //   },
  //
  //   {
  //     titulo: 'Mantenimientos',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu:[
  //       {titulo: 'Usuarios', url: 'usuarios'},
  //       {titulo: 'Hospitales', url: 'hospitales'},
  //       {titulo: 'Médicos', url: 'medicos'},
  //     ]
  //   }
  // ];

  constructor() {
  }
}
