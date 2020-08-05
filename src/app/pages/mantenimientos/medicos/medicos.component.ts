import {Component, OnDestroy, OnInit} from '@angular/core';
import {Medico} from '../../../models/medico.model';

import {MedicoService} from '../../../services/medico.service';
import {ModalImagenService} from '../../../services/modal-imagen.service';
import {BusquedasService} from '../../../services/busquedas.service';
import {Subscription} from 'rxjs';
import {delay} from 'rxjs/operators';
import Swal from "sweetalert2";

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html'
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  private imgSubscription: Subscription;

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) {
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubscription = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => this.cargarMedicos());
  }

  ngOnDestroy() {
    this.imgSubscription.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe(medicos => {
        this.cargando = false;
        this.medicos = medicos;
        // console.log(medicos);
      });
  }


  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  buscar(termino: string) {

    console.log(termino);
    if (termino.length === 0) {
      return this.cargarMedicos();
    }
    this.busquedasService.buscar('medicos', termino)
      .subscribe(response => {
        this.medicos = response;
      });
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Eliminar médico?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: '#ff0000',
      cancelButtonColor: '#a4a4a4',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.value) {
        this.medicoService.borrarMedico(medico._id)
          .subscribe(response => {
              this.cargarMedicos();
              Swal.fire(
                'Médico eliminado',
                `${medico.nombre} fue eliminado correctamente`,
                'success'
              );
            }
          );
      }
    });
  }
}
