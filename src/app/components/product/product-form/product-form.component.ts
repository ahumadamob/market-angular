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
import { ProductService } from '../product.service';
import { ProductCategoryService } from '../../product-category/product-category.service';
import { ProductForm } from '../product';
import { CategoryPathDTO } from '../../product-category/product-category';
import { HttpResponse } from '@angular/common/http';


declare var bootstrap: any;

@Component({
  selector: 'app-product-form',
  imports: [FormsModule, FormValidationComponent, QuitFormConfirmationModalComponent, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  @ViewChild('aForm') aFormRef!: NgForm;
  aForm: FormGroup = new FormGroup({}); 
  payload: ProductForm = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    productCategory: null
  };

  isEditMode = false;
  alertMessage: string | null = null;

  constructor(
    private service: ProductService,
    private categoryService: ProductCategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();
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
        if (this.categories.length > 0) {
          this.setSelectedCategory();
        }
      },
      error: (err) => {
      }
    });
  }

  categories: CategoryPathDTO[] = [];
  loadCategories(): void {
    this.categoryService.getCategoryPaths().subscribe(
      (categories: CategoryPathDTO[]) => {
        this.categories = categories;
        if (this.isEditMode && this.payload.productCategory) {
          this.setSelectedCategory();
        }
      }
    );
  }

  private setSelectedCategory() {
    if (this.payload.productCategory && this.payload.productCategory.id) {
      const selectedCategory = this.categories.find(cat => cat.id === this.payload.productCategory?.id);
      if (selectedCategory) {
        this.payload.productCategory = selectedCategory;
      }
    }
  }
  

  onSubmit() {
    if (this.payload.productCategory && typeof this.payload.productCategory !== 'object') {
      this.payload.productCategory = { id: Number(this.payload.productCategory)};
    }
    if (this.isEditMode) {
    this.service.update(this.payload).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.router.navigate(['/product'], { 
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
        next: (response: ApiResponse<ProductForm>) => {
          if (response.status === 201) {
            this.router.navigate(['/product'], { 
              state: { messages: response.messages }
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
    this.router.navigate(['/product']);
  }

}
