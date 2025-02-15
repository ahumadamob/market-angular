import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { AlertMessagesComponent } from '../../shared/alert-messages/alert-messages.component';
import { SortableTableHeaderComponent } from '../../shared/sortable-table-header/sortable-table-header.component';
import { ConfirmationModalComponent } from '../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
declare var bootstrap: any;

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, DatePipe, PaginationComponent, AlertMessagesComponent, ConfirmationModalComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  @ViewChild(ConfirmationModalComponent) confirmationModal!: ConfirmationModalComponent; 

  users: User[] = [];
  errorMessage: string = '';
  successMessage: string | null = null;

  sortableColumns: { field: keyof User; display: string }[] = [
    { field: 'id', display: 'ID' },
    { field: 'username', display: 'Usuario' },
    { field: 'email', display: 'Email' },
    { field: 'firstName', display: 'Nombre' },
    { field: 'lastName', display: 'Apellido' },
    { field: 'role', display: 'Rol' },
    { field: 'status', display: 'Estado' },
    { field: 'createdAt', display: 'Fecha de Creación' }
  ]; 
  sortDirection: { [key: string]: 'asc' | 'desc' | '' } = {};
  messages: { type: string; field?: string; content: string }[] = [];

  page: number = 0;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  isModalOpen = false;
  userToDeleteId: number = 0;


  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
    ['id', 'username', 'email', 'firstName', 'lastName', 'role', 'status', 'createdAt'].forEach(col => {
      this.sortDirection[col] = '';
    });
  }

  ngOnInit(): void {
    if (history.state?.messages) {
      this.messages = history.state.messages;
      console.info(this.messages)
    }

    this.loadUsers();

  }

  loadUsers(): void {
    this.userService.getUsersPaginated(this.page, this.itemsPerPage).subscribe(
      response => {
        console.log("Respuesta de la API:", response); // 👈 Agregado para depuración
        if (response.status === 200) {
          this.users = response.data.content;
          this.totalPages = response.data.totalPages;
        }
      },
      error => {
        this.errorMessage = 'Error al cargar los usuarios';
      }
    );
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.page = newPage;
      this.loadUsers();
    }
  }
  

  sortColumn(column: keyof User) {
    this.sortDirection[column] = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    const direction = this.sortDirection[column] === 'asc' ? 1 : -1;

    this.users.sort((a, b) => {
      const valueA = a[column] ?? '';
      const valueB = b[column] ?? '';
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * direction;
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * direction; // Comparación numérica
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return (valueA.getTime() - valueB.getTime()) * direction; // Comparación de fechas
      } else {
        // Manejo para otros tipos o tipos mixtos.  Aquí puedes decidir un comportamiento por defecto.
        return 0; // O lanzar un error, o usar toString() como en la opción 1.
      }
    });
  }

  getSortIcon(column: string): string {
    return this.sortDirection[column] === 'asc' ? 'bi-arrow-down' : this.sortDirection[column] === 'desc' ? 'bi-arrow-up' : 'bi-arrow-down-up';
  }

  newUser() {
    this.router.navigate(['/users/new']);
  }

  editUser(userId: number) {
    this.router.navigate(['/users', 'edit', userId]);
  }

  openDeleteModal(userId: number) {
    this.userToDeleteId = userId;
    if (this.confirmationModal) {
      this.confirmationModal.show(); // Llama a la función del componente hijo
    }
  }

  confirmDelete(id: number) {
    if (this.userToDeleteId !== null) {
      this.userService.deleteUser(id).subscribe({
        next: (response) => {
          if (response.status === 200) {
            // El servidor indica éxito en el borrado
            // Vuelves a cargar la lista o quitas el usuario localmente
            this.users = this.users.filter(u => u.id !== id);
                    // Reinicia la variable
          this.userToDeleteId = 0;
  
          // Cierra el modal
          const modalElement = document.getElementById('deleteModal');
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
          }
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar usuario.';
          console.error('Error en DELETE:', err);
        }
      });
      this.isModalOpen = false;
    }

  }

  
  getAlertClass(type: string): string {
    switch (type) {
      case 'ERROR': return 'alert alert-dismissible alert-danger';
      case 'WARNING': return 'alert alert-dismissible alert-warning';
      case 'INFO': return 'alert alert-dismissible alert-primary';
      case 'SUCCESS': return 'alert alert-dismissible alert-success';
      default: return 'alert alert-dismissible alert-secondary'; // Fallback
    }
  }

  onSortedData(sortedUsers: User[]) {
    this.users = sortedUsers;
  }
}