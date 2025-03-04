export enum AdjustmentType {
    TAX = 'Impuesto',       // Representa un impuesto aplicado al precio del producto
    DISCOUNT = 'Descuento', // Representa un descuento aplicado al precio del producto
    SURCHARGE = 'Recargo' // Representa un recargo añadido al precio del producto
  }
  export interface AdjustmentConfig {
    id: number; // Identificador único del ajuste
    name: string; // Nombre del ajuste, no puede estar vacío y tiene un máximo de 100 caracteres
    type: AdjustmentType; // Tipo de ajuste
    value: number; // Valor del ajuste, debe ser un número positivo
    percentage: boolean; // Indica si el valor es un porcentaje
    addition: boolean; // Indica si el ajuste se suma (true) o se resta (false) al precio base
    startDate: string; // Fecha de inicio de vigencia en formato ISO (YYYY-MM-DD)
    endDate?: string; // Fecha de fin de vigencia en formato ISO (YYYY-MM-DD), opcional
    displayOnPage: boolean; // Indica si el ajuste debe mostrarse en la página
    createdAt: Date; // Fecha de creación
    updatedAt: Date; // Fecha de última actualización
  }

  export interface AdjustmentConfigForm {
    id: number; // Identificador único del ajuste
    name: string; // Nombre del ajuste, no puede estar vacío y tiene un máximo de 100 caracteres
    type: AdjustmentType; // Tipo de ajuste
    value: number; // Valor del ajuste, debe ser un número positivo
    percentage: boolean; // Indica si el valor es un porcentaje
    addition: boolean; // Indica si el ajuste se suma (true) o se resta (false) al precio base
    startDate: string; // Fecha de inicio de vigencia en formato ISO (YYYY-MM-DD)
    endDate?: string; // Fecha de fin de vigencia en formato ISO (YYYY-MM-DD), opcional
    displayOnPage: boolean; // Indica si el ajuste debe mostrarse en la página
  }