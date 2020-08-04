import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import Swal from 'sweetalert2';
import {Hospital} from '../../../models/hospital.model';
import {Medico} from '../../../models/medico.model';

import {HospitalService} from '../../../services/hospital.service';
import {MedicoService} from '../../../services/medico.service';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({id}) => this.cargarMedico(id));

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();

    // Creamos un observable que nos
    // notifique cuando se seleccione un hospital
    this.medicoForm.get('hospital').valueChanges
      .subscribe(hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);
        // console.log(this.hospitalSeleccionado);
      });
  }

  cargarMedico(id: string) {

    if (id === 'nuevo') {
      return;
    }

    this.medicoService.obtenerMedicoPorId(id)
      .pipe(delay(100))
      .subscribe(medico => {
        // console.log(medico);
        if (!medico) {
          return this.router.navigateByUrl(`/dashboard/medicos`);
        }
        const {nombre, hospital: {_id}} = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({nombre, hospital: _id});
      });
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        // console.log(hospitales);
        this.hospitales = hospitales;
      });
  }

  guardarMedico() {

    const {nombre} = this.medicoForm.value;
    if (this.medicoSeleccionado) {
      // Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      };
      this.medicoService.actualizarMedico(data)
        .subscribe(response => {
          console.log(response);
          Swal.fire('Médico actualizado', `${nombre} actualizado correctamente`, 'success');
        });
    } else {
      // Crear

      console.log(this.medicoForm.value);
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe((response: any) => {
          // console.log(response);
          Swal.fire('Médico creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${response.medico._id}`);
        });
    }
  }
}
