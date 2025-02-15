import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-confirmation-modal',
  imports: [CommonModule],
  templateUrl: './quit-form-confirmation-modal.component.html',
  styleUrls: ['./quit-form-confirmation-modal.component.css']
})
export class QuitFormConfirmationModalComponent {
  @Input() title: string = 'Confirmación';
  @Input() message: string = '¿Estás seguro de realizar esta acción?';
  @Input() confirmButtonText: string = 'Aceptar';
  @Input() cancelButtonText: string = 'Cancelar';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  show(): void {
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onConfirm(): void {
    this.confirm.emit();
    this.hide();
  }

  onCancel(): void {
    this.cancel.emit();
    this.hide();
  }

  hide(): void {
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
}

