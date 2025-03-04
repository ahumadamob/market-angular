import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, FormGroup } from '@angular/forms';
import { ApiResponse } from '../../shared/api-response';
import { FormValidationComponent } from '../../shared/form-validation/form-validation.component';
import { ErrorResponse } from '../../shared/form-validation/error-response.interface';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QuitFormConfirmationModalComponent } from '../../shared/quit-form-confirmation-modal/quit-form-confirmation-modal.component';
import { ProductCategoryService } from '../product-category.service';
import { ProductCategoryForm } from '../product-category';


declare var bootstrap: any;

@Component({
  selector: 'app-product-category-form',
  imports: [FormsModule, FormValidationComponent, QuitFormConfirmationModalComponent, CommonModule],
  templateUrl: './product-category-form.component.html',
  styleUrl: './product-category-form.component.css'
})
export class ProductCategoryFormComponent {
  @ViewChild('aForm') aFormRef!: NgForm;
  aForm: FormGroup = new FormGroup({}); 
  payload: ProductCategoryForm = {
    id: 0, 
    name: '',
    parent: null
  };

  isEditMode = false;
  alertMessage: string | null = null;

  constructor(
    private service: ProductCategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const editId = this.route.snapshot.paramMap.get('id');
    if (editId) {
      this.isEditMode = true;
      this.load(Number(editId));
    }
    this.errorResponse = null;
  }

  load(id: number) {
    this.service.getById(id).subscribe({
      next: (response) => {
        this.payload = response.data;
      },
      error: (err) => {
      }
    });
  }

  onSubmit() {
    if (this.isEditMode) {
    this.service.update(this.payload).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.router.navigate(['/product-category'], { 
            state: { messages: response.messages }
          });
        }
      },
      error: (error) => {
        this.handleError(error);
      },
    });

    } else {
      this.service.create(this.payload).subscribe({
        next: (response: ApiResponse<ProductCategoryForm>) => {
          if (response.status === 201) {
            this.router.navigate(['/product-category'], { 
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
    this.router.navigate(['/product-category']);
  }

}
