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
  errorMessage: string = '';
  successMessage: string | null = null;
  userToDeleteId: number | null = null;
  sortDirection: { [key: string]: 'asc' | 'desc' | '' } = {};

  constructor(private userService: UserService, private router: Router) {
    ['id', 'username', 'email', 'firstName', 'lastName', 'role', 'status', 'createdAt'].forEach(col => {
      this.sortDirection[col] = '';
    });
  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['successMessage']) {
      this.successMessage = navigation.extras.state['successMessage'];
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      response => {
        if (response.status === 200) {
          this.users = response.data;
        }
      },
      error => {
        this.errorMessage = 'Error al cargar los usuarios';
      }
    );
  }

  sortColumn(column: keyof User) {
    this.sortDirection[column] = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    const direction = this.sortDirection[column] === 'asc' ? 1 : -1;

    this.users.sort((a, b) => {
      const valueA = a[column] ?? '';
      const valueB = b[column] ?? '';
      return valueA.localeCompare(valueB) * direction;
    });
  }

  getSortIcon(column: string): string {
    return this.sortDirection[column] === 'asc' ? 'bi-arrow-down' : this.sortDirection[column] === 'desc' ? 'bi-arrow-up' : 'bi-arrow-down-up';
  }

  newUser() {
    this.router.navigate(['/users/new']);
  }

  editUser(userId: number) {
    this.router.navigate([`/users/edit`, userId]);
  }

  openDeleteModal(userId: number) {
    this.userToDeleteId = userId;
    const modalElement = document.getElementById('deleteModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  confirmDelete() {
    if (this.userToDeleteId !== null) {
      this.userService.deleteUser(this.userToDeleteId).subscribe(
        () => {
          this.users = this.users.filter(user => user.id !== this.userToDeleteId);
          this.userToDeleteId = null;
          const modalElement = document.getElementById('deleteModal');
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        },
        error => {
          this.errorMessage = 'Error al eliminar el usuario';
        }
      );
    }
  }
}