import { ErrorMessage } from './error-message.interface';

export interface ErrorResponse {
  status: number; // Código de estado HTTP (ejemplo: 400)
  messages: ErrorMessage[]; // Lista de mensajes de error
  data?: any; // Puede ser null u otro dato (según la API)
}
