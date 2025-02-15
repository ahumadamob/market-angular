import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorResponse } from './error-response.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-validation',
  imports: [CommonModule],
  templateUrl: './form-validation.component.html',
  styleUrls: ['./form-validation.component.css'],
})
export class FormValidationComponent implements OnChanges {
  @Input() form!: FormGroup; // Formulario Angular
  @Input() errorResponse!: ErrorResponse | null; // Respuesta de error del backend

  formFields: string[] = []; // Lista de campos del formulario

  ngOnChanges(): void {
    if (this.form) {
      this.formFields = Object.keys(this.form.controls); // Extrae los nombres de los campos
    }

    if (this.errorResponse && this.errorResponse.messages) {
      this.applyValidationErrors();
    }
  }

  private applyValidationErrors(): void {
    if (!this.form) {
      console.error('El formulario no está definido aún.');
      return;
    }
  
    this.clearValidationErrors();
  
    this.errorResponse?.messages.forEach((message) => {
      if (message.type === 'ERROR' && message.field) {
        const fieldName = message.field;
        const content = message.content;
  
        // Asegurar que el formulario tiene el control antes de acceder
        if (this.form.contains(fieldName)) {
          const formControl = this.form.get(fieldName);
          if (formControl) {
            formControl.setErrors({ backendError: content });
            formControl.markAsTouched();
          }
        } else {
          console.warn(`El campo '${fieldName}' no existe en el formulario.`);
        }
      }
    });
  }
  

  private clearValidationErrors(): void {
    this.formFields.forEach((field) => {
      this.form.controls[field].setErrors(null);
    });
  }
}
