import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { AlertMessagesComponent } from '../../shared/alert-messages/alert-messages.component';
import { SortableTableHeaderComponent } from '../../shared/sortable-table-header/sortable-table-header.component';
import { ConfirmationModalComponent } from '../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
declare var bootstrap: any;

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, DatePipe, PaginationComponent, AlertMessagesComponent, ConfirmationModalComponent,SortableTableHeaderComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  
  @ViewChild(ConfirmationModalComponent) confirmationModal!: ConfirmationModalComponent; 

  ngOnInit(): void {
    if (history.state?.messages) {
      this.messages = history.state.messages;
      console.info(this.messages)
    }
    this.loadUsers();
  }

  constructor(private userService: UserService, private router: Router) {
  }

  /**
   * SortableTableHeader
   */
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

  updateSortedData(sortedUsers: User[]): void {
    this.users = sortedUsers;
  }

  onSortedData(sortedUsers: User[]) {
    this.users = sortedUsers;
  }

  /**
   * Pagination
   */
  page: number = 0;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.page = newPage;
      this.loadUsers();
    }
  }

  /**
   * AlertMessages
   */
  errorMessage: string = '';
  successMessage: string | null = null;
  messages: { type: string; field?: string; content: string }[] = [];
  isModalOpen = false;


  /**
   * List
   */
  users: User[] = []; 

  loadUsers(): void {
    this.userService.getUsersPaginated(this.page, this.itemsPerPage).subscribe(
      response => {
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

  /**
   * New
   */

  newUser() {
    this.router.navigate(['/user/new']);
  }

  /**
   * Edit
   */

  editUser(userId: number) {
    this.router.navigate(['/users', 'edit', userId]);
  }

  /**
   * Delete
   */
  userToDeleteId: number = 0;

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
            this.users = this.users.filter(u => u.id !== id);
            this.userToDeleteId = 0;
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

}