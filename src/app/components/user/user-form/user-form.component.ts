import { Component } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-user-form',
  imports: [FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  user: User = {
    id: 0,
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER',  // Valor por defecto
    status: 'ACTIVE',  // Valor por defecto
    createdAt: new Date(),
    updatedAt: new Date(),
    isVerified: false,
  };
  isEditMode = false; // Para saber si estamos editando

  constructor(
    private userService: UserService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    
    if (userId) {
      this.isEditMode = true;
      const id = Number(userId);
      // Llamada a un servicio o lógica para obtener el usuario por id
      this.loadUser(id);
    }
  }
 
  loadUser(id: number) {
    // Aquí cargarías el usuario desde tu backend o servicio
    // Simularemos con los datos existentes
    const mockUsers: User[] = [
      { id: 1, username: 'usuario1', email: 'email1@example.com', password: '', firstName: 'Nombre1', lastName: 'Apellido1', role: 'USER', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date(), isVerified: true },
      { id: 2, username: 'usuario2', email: 'email2@example.com', password: '', firstName: 'Nombre2', lastName: 'Apellido2', role: 'USER', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date(), isVerified: true }
    ];

    const foundUser = mockUsers.find(user => user.id === id);
    if (foundUser) {
      this.user = foundUser;
    }
  } 

  onSubmit() {
     if (this.isEditMode) {
      // Lógica para actualizar el usuario
      console.log('Usuario actualizado', this.user);
    } else {
      this.userService.addUser(this.user);
    }   
    
    this.router.navigate(['/users']);  // Redirige de nuevo a la lista de usuarios
  }

    // Método para abrir el modal de cancelación
    openCancelModal() {
      const modalElement = document.getElementById('cancelModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }

    cancel() {
      const modalElement = document.getElementById('cancelModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement); // Obtén la instancia del modal
        if (modalInstance) {
          modalInstance.hide();
          this.router.navigate(['/users']);
        }
      }
    }
}

