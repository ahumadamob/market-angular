import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ErrorMessage } from './error-message.interface'; // Tu interface
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-validation',
  imports: [CommonModule],
  templateUrl: './form-validation.component.html',
})
export class FormValidationComponent implements OnChanges {
  @Input() form!: FormGroup | NgForm; // Acepta ambos
  //@Input() errorResponse!: { messages: ErrorMessage[] };
  @Input() errorResponse: { messages: ErrorMessage[] } | null = null;


  ngOnChanges(): void {
    console.info('🔍 Iniciando validación...');
    const fieldNames = this.getFormFieldNames();
    console.info('📊 Campos obtenidos:', fieldNames);
    if (this.form) {
      this.applyValidationErrors();
    }
  }

  private applyValidationErrors(): void {
    if (this.errorResponse && this.errorResponse.messages) {
      this.errorResponse.messages.forEach((message) => {
        const fieldName = message.field;
        const content = message.content;
  
        if (this.form instanceof NgForm) {
          const control = this.form.controls[fieldName];
          if (control) {
            //control.setErrors({ backendError: content });

            const inputElement = document.querySelector(`[name="${fieldName}"]`);
            if (inputElement) {
              inputElement.classList.add('is-invalid');
              const feedbackElement = inputElement.nextElementSibling;
              if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
                feedbackElement.textContent = content;
              }
            }
          }
        }
      });
    }
  }
  

  // Obtiene los nombres de los campos del formulario
  getFormFieldNames(): string[] {
    if (this.form instanceof NgForm) {
      return Object.keys(this.form.controls);
    }
    return [];
  }
  

// Obtiene el error del backend para un campo
getBackendError(fieldName: string): string | null {
  let control;
  if (this.form instanceof FormGroup) {
    control = this.form.get(fieldName);
  } else if (this.form instanceof NgForm) {
    control = this.form.controls[fieldName];
  }

  return control?.errors?.['backendError'] ?? null;
}

}
