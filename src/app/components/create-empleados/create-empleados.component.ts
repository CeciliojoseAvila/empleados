import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-create-empleados',
  templateUrl: './create-empleados.component.html',
  styleUrls: ['./create-empleados.component.css']
})
export class CreateEmpleadosComponent implements OnInit{
  createEmpleado: FormGroup;
  submitted = false;
  Loading = false;
  id: string | null;
  titulo = 'Agregar Empleado';

  constructor(private fb: FormBuilder,
    private _empleadoService: EmpleadoService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute) {
    
    this.createEmpleado = this.fb.group({
      Nombres: ['', Validators.required],
      Apellidos: ['', Validators.required],
      Documento: ['', Validators.required],
      Salario: ['', Validators.required],
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
   }

  ngOnInit(): void {
    this.esEditar();
  }

  agregarEditarEmpleado() { 
    this.submitted = true;

    if (this.createEmpleado.invalid) {
      return;
    }

    if (this.id === null) {
      this.agregarEmpleado
    } else { 
      this.editarEmpleado(this.id);
    }

  }

  agregarEmpleado() {     
    const empleado: any = {
      Nombres: this.createEmpleado.value.Nombres,
      Apellidos: this.createEmpleado.value.Apellidos,
      Documento: this.createEmpleado.value.Documento,
      Salario: this.createEmpleado.value.Salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }

    this.Loading = true;
    this._empleadoService.agregarEmpleado(empleado).then(() => { 
      this.toastr.success('El empleado fue registrado con exito!', ' Empleado registrado', { positionClass: 'toast-bottom-right' });
      this.Loading = false;
      this.router.navigate(['/list-empleados']);
    }).catch(error => { 
      console.log(error);
      this.Loading = false;
    })

  }

  editarEmpleado(id:string) { 
      const empleado: any = {
      Nombres: this.createEmpleado.value.Nombres,
      Apellidos: this.createEmpleado.value.Apellidos,
      Documento: this.createEmpleado.value.Documento,
      Salario: this.createEmpleado.value.Salario,      
      fechaActualizacion: new Date()
    }
    this.Loading = true;
    this._empleadoService.actualizarEmpleado(id, empleado).then(() => { 
      this.Loading = false;
      this.toastr.info('El empleado fue modificado con éxito', 'Empleado modificado', {
        positionClass: 'toast-bottom-right'
      })
      this.router.navigate(['/list-empleados']);
    })
  }

  esEditar() { 
    this.titulo = 'Editar Empleado'
    if (this.id !== null) {

      this.Loading = true;
      this._empleadoService.getEmpleado(this.id).subscribe(data => { 
        this.Loading = false;
        console.log(data.payload.data()['nombre']);
        this.createEmpleado.setValue({
          Nombres: data.payload.data()['Nombres'],
          Apellidos: data.payload.data()['Apellidos'],
          Documento: data.payload.data()['Documento'],
          Salario: data.payload.data()['Salario'],
        })
      })
    }
  }
}
