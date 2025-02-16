import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-confirmation-modal',
  imports: [CommonModule],
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  @Input() title: string = 'Confirmar Eliminación';
  @Input() message: string = '¿Estás seguro que deseas eliminar este usuario?';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  confirm() {
    this.onConfirm.emit();
  }

  close() {
    this.onClose.emit();
  }

  show(){
    const modalElement = document.getElementById('deleteModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  
}
