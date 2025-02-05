import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-user-form',
  imports: [FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  user: User = {
    id: 0,
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
    isVerified: false,
  };
  isEditMode = false;
  alertMessage: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.isEditMode = true;
      this.loadUser(Number(userId));
    }
  }

  loadUser(id: number) {
    this.userService.getUserById(id).subscribe(
      user => this.user = user,
      error => this.alertMessage = 'Error al cargar el usuario'
    );
  }

  onSubmit() {
    if (this.isEditMode) {
      this.userService.updateUser(this.user).subscribe(
        () => {
          const navigationExtras: NavigationExtras = {
            state: { successMessage: 'Usuario actualizado correctamente' }
          };
          this.router.navigate(['/users'], navigationExtras);
        },
        error => this.alertMessage = 'Error al actualizar el usuario'
      );
    } else {
      this.userService.createUser(this.user).subscribe(
        () => {
          const navigationExtras: NavigationExtras = {
            state: { successMessage: 'Usuario creado correctamente' }
          };
          this.router.navigate(['/users'], navigationExtras);
        },
        error => this.alertMessage = 'Error al crear el usuario'
      );
    }
  }

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
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
        this.router.navigate(['/users']);
      }
    }
  }
}