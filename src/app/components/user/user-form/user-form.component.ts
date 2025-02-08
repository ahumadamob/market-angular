import { Component, OnInit } from '@angular/core';
import { User, UserForm } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../user.service';
declare var bootstrap: any;

@Component({
  selector: 'app-user-form',
  imports: [FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
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
          // Manejo de error
          this.handleError(error);
        },
      });
    }
  }


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