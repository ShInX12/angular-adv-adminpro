import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {delay} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {Hospital} from '../../../models/hospital.model';
import {HospitalService} from '../../../services/hospital.service';
import {ModalImagenService} from '../../../services/modal-imagen.service';
import {BusquedasService} from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  // public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubscription: Subscription;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) {
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubscription = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(() => this.cargarHospitales());
  }

  ngOnDestroy() {
    this.imgSubscription.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe(
        hospitales => {
          this.hospitales = hospitales;
          // this.hospitalesTemp = hospitales;
          this.cargando = false;
        }
      );
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(response => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }

  borrarHospital(hospital: Hospital) {
    this.hospitalService.borrarHospital(hospital._id)
      .subscribe(response => {
        this.cargarHospitales();
        Swal.fire('Eliminado', hospital.nombre, 'success');
      });
  }

  async abrirSweetAlert() {
    const {value = ''} = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    });
    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value)
        .subscribe(response => {
          this.cargarHospitales();
        });
    }
  }

  buscar(termino: string) {

    console.log(termino);
    if (termino.length === 0) {
      return this.cargarHospitales();
    }
    this.busquedasService.buscar('hospitales', termino)
      .subscribe(response => {
        this.hospitales = response;
      });
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }
}
