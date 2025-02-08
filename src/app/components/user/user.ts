export interface User {
    id: number; // Identificador único
    username: string; // Nombre de usuario único
    password: string; // Contraseña (encriptada)
    email: string; // Correo electrónico único
    firstName: string; // Nombre del usuario
    lastName: string; // Apellido del usuario
    role: 'ADMIN' | 'USER'; // Rol del usuario
    status: 'ACTIVE' | 'INACTIVE'; // Estado del usuario
    createdAt: Date; // Fecha de creación
    updatedAt: Date; // Fecha de última actualización
    lastLogin?: Date; // Fecha de último inicio de sesión (opcional)
    profilePicture?: string; // URL de imagen de perfil (opcional)
    phoneNumber?: string; // Número de teléfono (opcional)
    address?: string; // Dirección del usuario (opcional)
    isVerified: boolean; // Verificación de correo/teléfono
  }

  export interface UserForm {
    id: number;
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'USER';
    status: 'ACTIVE' | 'INACTIVE';
    isVerified: boolean;
    phoneNumber?: string;
    address?: string;
    profilePicture?: string;
  }
  
