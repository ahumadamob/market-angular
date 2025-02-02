import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, DatePipe],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  userToDeleteId: number | null = null;
  sortDirection: { [key: string]: 'asc' | 'desc' | '' } = {};

  constructor(private userService: UserService, private router: Router) {
    ['id', 'username', 'email', 'firstName', 'lastName', 'role', 'status', 'createdAt'].forEach(col => {
      this.sortDirection[col] = '';
    });   
  }

  sortColumn(column: keyof User) {
    this.sortDirection[column] = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    const direction = this.sortDirection[column] === 'asc' ? 1 : -1;
  
    this.users.sort((a, b) => {
      const valueA = a[column] ?? ''; // Usamos '??' para asignar un valor por defecto si es undefined
      const valueB = b[column] ?? '';
  
      if (valueA < valueB) return -1 * direction;
      if (valueA > valueB) return 1 * direction;
      return 0;
    });
  }
  
  
  getSortIcon(column: string): string {
    return this.sortDirection[column] === 'asc' ? 'bi-arrow-down' : this.sortDirection[column] === 'desc' ? 'bi-arrow-up' : 'bi-arrow-down-up';
  }

  ngOnInit(): void {
    this.users = this.userService.getUsers();
  }

  newUser() {
    this.router.navigate(['/users/new']);  // Ruta hacia el formulario
  }
  
  
  editUser(userId: number) {
    this.router.navigate([`/users/edit`, userId]);
  }
    // Abrir el modal para confirmar la eliminación
    openDeleteModal(index: number) {
      this.userToDeleteId = index; // Almacena el índice del usuario a eliminar
      const modalElement = document.getElementById('deleteModal');
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  
    confirmDelete() {
      if (this.userToDeleteId !== null) {
        // Eliminar el usuario por ID
        this.users = this.users.filter(user => user.id !== this.userToDeleteId);
        this.userToDeleteId = null; // Reiniciar el ID
  
        // Cierra el modal después de eliminar
        const modalElement = document.getElementById('deleteModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    }
}

