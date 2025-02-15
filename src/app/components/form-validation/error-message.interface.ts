export interface ErrorMessage {
    type: string; // ERROR, WARNING, INFO, SUCCESS
    field: string; // Nombre del campo que tiene el error
    content: string; // Mensaje de error asociado al campo
  }
  