import { Component, OnInit } from '@angular/core';
import { User, UserForm } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validator } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
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
    console.info(userId);
    if (userId) {
      this.isEditMode = true;
      this.loadUser(Number(userId));
    }
    this.errorResponse = null; // ✅ Inicializar errorResponse
  }

  loadUser(id: number) {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        this.user = response.data; // Rellena todo el formulario con la data recibida
      },
      error: (err) => {
        // Maneja el error (404, por ejemplo, si el usuario no existe)
      }
    });
  }

  onSubmit() {
    if (this.isEditMode) {
    // Llamada a updateUser
    this.userService.updateUser(this.user).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.router.navigate(['/users'], { 
            state: { messages: response.messages } // Pasamos los mensajes a UserListComponent
          });
        }
      },
      error: (error) => {
        // Manejar error (400, 404, etc.)
        console.error('Va a dispararse en handleError')
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
          console.error('Va a dispararse en handleError')
          // Manejo de error
          this.handleError(error);
        },
      });
    }
  }

  errorResponse: ErrorResponse | null = null;

  handleError(errorResponse: any): void {
    console.error("ahora se ejecuta en handleError");
    console.error('Respuesta del error del Backend', errorResponse);
    if (errorResponse.status === 400 && errorResponse.error.messages) {
      this.errorResponse = errorResponse.error;
    }
  }
  

  /*
  handleError(error: HttpErrorResponse) {
    this.clearValidationErrors();
  
    console.log('Status:', error.status);
    if (error.status === 400 && error.error) {
      const errorResponse = error.error;
  
      if (errorResponse.messages && Array.isArray(errorResponse.messages)) {
        errorResponse.messages.forEach((message: any) => {
          if (message.type === 'ERROR' && message.field) {
            const field = message.field;
            const content = message.content;
  
            // 2. Encuentra el elemento en base al [name] del campo
            //    Buscamos tanto input, select o textarea, según corresponda
            const inputElement: HTMLElement | null = document.querySelector(
              `input[name="${field}"], select[name="${field}"], textarea[name="${field}"]`
            );
  
            if (inputElement) {
              // Agrega la clase .is-invalid para el borde rojo
              inputElement.classList.add('is-invalid');
  
              // 3. Busca el .invalid-feedback hermano y asigna el texto del error
              const feedbackElement = inputElement.closest('.mb-3')?.querySelector('.invalid-feedback');
              if (feedbackElement) {
                feedbackElement.textContent = content;
              }
            }
          }
        });
      } else {
        console.error('Error del backend:', errorResponse);
        this.alertMessage = 'Error en el formulario. Por favor, revisa los campos.';
      }
    } else if (error.status === 401) {
      this.alertMessage = 'No tienes autorización para realizar esta acción.';
    } else {
      console.error('Error inesperado:', error);
      this.alertMessage = 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente más tarde.';
    }
  }
    */

  private clearValidationErrors() {
    // Selecciona todos los inputs o selects marcados como .is-invalid
    const invalidFields = document.querySelectorAll('.is-invalid');
    invalidFields.forEach((field) => {
      field.classList.remove('is-invalid');
    });
  
    // Limpia el texto en .invalid-feedback
    const feedbackElements = document.querySelectorAll('.invalid-feedback');
    feedbackElements.forEach((feedback) => {
      feedback.textContent = '';
    });
  }

 

  openCancelModal() {
    const modalElement = document.getElementById('cancelModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onCancelClosed(): void {
    console.log('Modal cerrado sin confirmar.');
  }

  cancel(): void {
    console.log('Acción confirmada: Descartar cambios.');
    this.router.navigate(['/users']);
  }

}