import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BusquedasService} from '../../services/busquedas.service';
import {Usuario} from '../../models/usuario.model';
import {Medico} from '../../models/medico.model';
import {Hospital} from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html'
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private busquedasService: BusquedasService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(({termino}) => this.busquedaGlobal(termino));
  }

  busquedaGlobal(termino: string) {
    this.busquedasService.busquedaGlobal(termino)
      .subscribe((response: any) => {
        console.log(response);
        this.usuarios = response.usuarios;
        this.medicos = response.medicos;
        this.hospitales = response.hospitales;
      });
  }

  abrirMedico(medico: Medico) {
    console.log(medico);
  }
}
