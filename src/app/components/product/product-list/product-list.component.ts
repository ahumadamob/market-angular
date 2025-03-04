import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { AlertMessagesComponent } from '../../shared/alert-messages/alert-messages.component';
import { SortableTableHeaderComponent } from '../../shared/sortable-table-header/sortable-table-header.component';
import { ConfirmationModalComponent } from '../../shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { LoadingComponent } from '../../shared/loading-interceptor/loading.component';
import { HttpResponse } from '@angular/common/http';
import { ProductService } from '../product.service';
import { Product } from '../product';
declare var bootstrap: any;

@Component({
  selector: 'product-list',
  imports: [CommonModule, 
    DatePipe, PaginationComponent, AlertMessagesComponent, ConfirmationModalComponent,SortableTableHeaderComponent,
    LoadingComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {
  
  @ViewChild(ConfirmationModalComponent) confirmationModal!: ConfirmationModalComponent; 

  ngOnInit(): void {
    if (history.state?.messages) {
      this.messages = history.state.messages;
      console.info(this.messages)
    }
    this.loadAll();
  }

  constructor(private service: ProductService, private router: Router) {
  }

  /**
   * SortableTableHeader
   */
  sortableColumns: { field: keyof Product; display: string }[] = [
    { field: 'id', display: 'ID' },
    { field: 'name', display: 'Nombre' },
    { field: 'productCategory', display: 'Categoría' },
    { field: 'price', display: 'Precio' },
    { field: 'createdAt', display: 'Creado' },
    { field: 'updatedAt', display: 'Modificado' },   

  ];

  updateSortedData(sortedList: Product[]): void {
    this.list = sortedList;
  }

  onSortedData(sortedList: Product[]) {
    this.list = sortedList;
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
      this.loadAll();
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
  list: Product[] = []; 

  loadAll(): void {
    this.service.getAllPaginated(this.page, this.itemsPerPage).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.list = response.body.data.content;
          this.totalPages = response.body.data.totalPages;
        } else if (response.status === 204) {
          this.errorMessage = 'No existen productos';
        }
      },
      error => {
        this.errorMessage = 'Error al cargar los productos';
      }
    );
  }

  /**
   * New
   */

  new() {
    this.router.navigate(['/product/new']);
  }

  /**
   * Edit
   */

  edit(id: number) {
    this.router.navigate(['/product', 'edit', id]);
  }

  /**
   * Delete
   */
  idToDelete: number = 0;

  openDeleteModal(idToDelete: number) {
    this.idToDelete = idToDelete;
    if (this.confirmationModal) {
      this.confirmationModal.show(); // Llama a la función del componente hijo
    }
  }

  confirmDelete(id: number) {
    if (this.idToDelete !== null) {
      this.service.delete(id).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.list = this.list.filter(e => e.id !== id);
            this.idToDelete = 0;
            const modalElement = document.getElementById('deleteModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar el producto';
        }
      });
      this.isModalOpen = false;
    }
  }

}