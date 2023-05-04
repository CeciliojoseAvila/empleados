import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit{
  empleados: any[] = [];
 // items: Observable<any[]>; Y en el constructor iba: (firestore: AngularFirestore)

  constructor(private _empleadoService: EmpleadoService,
              private toastr: ToastrService ) { 
   // this.items = firestore.collection('items').valueChanges();
  }
  ngOnInit(): void {    
    this.getEmpleados();
  }

  getEmpleados() { 
    this._empleadoService.getEmpleados().subscribe(data => {
      this.empleados = [];
      data.forEach((element: any) => {/* 
        console.log(element.payload.doc.id); */
        /* console.log(element.payload.doc.data()); */
        this.empleados.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      console.log(this.empleados);
    });
  }

  eliminarEmpleado(id:string) { 
    return this._empleadoService.eliminarEmpleado(id).then(() => {
      console.log('empleado eliminado con exito');
      this.toastr.error('El empleado fue eliminado con exito', 'Registro eliminado!', {
        positionClass: 'toast-bottom-right'
      });
    }).catch(error => {
      console.log(error);
    });
  }

}
