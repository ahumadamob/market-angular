export interface ProductCategory {
    id: number; 
    name: string; 
    parent?: ProductCategory;
    createdAt: Date;
    updatedAt?: Date; 
  }

  export interface ProductCategoryForm {
    id: number; 
    name?: string | null; 
    parent?: ProductCategory | null;
  }
  
  export interface CategoryPathDTO{
    id: number,
    value: string
  }