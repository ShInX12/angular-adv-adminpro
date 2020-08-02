import {Component, OnInit} from '@angular/core';
import {ModalImagenService} from '../../service/modal-imagen.service';
import {FormGroup} from '@angular/forms';
import {Usuario} from '../../models/usuario.model';
import Swal from "sweetalert2";
import {FileUploadService} from '../../services/file-upload.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html'
})
export class ModalImagenComponent implements OnInit {

  public imagenASubir: File;
  public imgTemp: any = null;

  // Se pone public para poder pasarlo por referencia
  // y que sea visible en el HTML por ejemplo
  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {
  }


  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }


  cambiarImagen(file: File) {
    this.imagenASubir = file;
    if (!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  subirImagen() {
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;
    this.fileUploadService.actualizarFoto(this.imagenASubir, tipo, id)
      .then(img => {
        Swal.fire('Guardado', 'Imagen del usuario actualizada', 'success');
        this.modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
      }).catch(error => {
      console.log(error);
      Swal.fire('Error', 'No se pudo subir la imágen', 'error');
    });
  }
}
