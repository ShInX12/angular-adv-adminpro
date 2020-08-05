import {Component, OnDestroy, OnInit} from '@angular/core';
import Swal from 'sweetalert2';

import {UsuarioService} from '../../../services/usuario.service';
import {BusquedasService} from '../../../services/busquedas.service';
import {ModalImagenService} from '../../../services/modal-imagen.service';

import {Usuario} from '../../../models/usuario.model';
import {delay} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubscription: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(private usuarioService: UsuarioService,
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService) {
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    // Nos suscribimos para estar pendiente cuando
    // se suba una nueva imagen
    this.imgSubscription = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(() => this.cargarUsuarios());
  }

  ngOnDestroy(): void {
    this.imgSubscription.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({totalRegistros, usuarios}) => {
        this.totalUsuarios = totalRegistros;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedasService.buscar('usuarios', termino)
      .subscribe(response => this.usuarios = response);
  }

  eliminarUsuario(usuario: Usuario) {

    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire('Error', 'No te puedes borrar a ti mismo', 'error');
    }

    Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: '#ff0000',
      cancelButtonColor: '#a4a4a4',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario(usuario)
          .subscribe(response => {
              Swal.fire(
                'Usuario eliminado',
                `${usuario.nombre} fue eliminado correctamente`,
                'success'
              );
              this.cargarUsuarios();
            }
          );
      }
    });
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario)
      .subscribe(response => {
      });
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
