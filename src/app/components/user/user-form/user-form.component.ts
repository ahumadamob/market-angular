import { Component, OnInit } from '@angular/core';
import { UserForm } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, FormGroup } from '@angular/forms';
import { ApiResponse } from '../user.service';
import { FormValidationComponent } from '../../shared/form-validation/form-validation.component';
import { ErrorResponse } from '../../shared/form-validation/error-response.interface';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QuitFormConfirmationModalComponent } from '../../shared/quit-form-confirmation-modal/quit-form-confirmation-modal.component';


declare var bootstrap: any;

@Component({
  selector: 'app-user-form',
  imports: [FormsModule, FormValidationComponent, QuitFormConfirmationModalComponent],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})

export class UserFormComponent implements OnInit {
  @ViewChild('userForm') userFormRef!: NgForm;
  userForm: FormGroup = new FormGroup({}); // Asegurar que no sea undefined
  user: UserForm = {
    id: 0,
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER',
    status: 'ACTIVE',
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
    this.errorResponse = null;
  }

  loadUser(id: number) {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        this.user = response.data;
      },
      error: (err) => {
      }
    });
  }

  onSubmit() {
    if (this.isEditMode) {
    this.userService.updateUser(this.user).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.router.navigate(['/users'], { 
            state: { messages: response.messages }
          });
        }
      },
      error: (error) => {
        this.handleError(error);
      },
    });

    } else {
      this.userService.createUser(this.user).subscribe({
        next: (response: ApiResponse<UserForm>) => {
          if (response.status === 201) {
            this.router.navigate(['/users'], { 
              state: { messages: response.messages } // Pasamos los mensajes a UserListComponent
            });
          }
        },
        error: (error) => {
          this.handleError(error);
        },
      });
    }
  }

  errorResponse: ErrorResponse | null = null;

  handleError(errorResponse: any): void {
    if (errorResponse.status === 400 && errorResponse.error.messages) {
      this.errorResponse = errorResponse.error;
    }
  }

  onCancelClosed(): void {
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }

}