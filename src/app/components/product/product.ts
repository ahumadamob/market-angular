import { ProductCategory, ProductCategoryForm } from "../product-category/product-category"

export interface Product{
    id: number,
    createdAt?: Date,
    updatedAt?: Date,
    name: string,
    description?: string,
    price: number,
    productCategory: ProductCategory
}


export interface ProductForm {
    id: number,
    name: string,
    description?: string,
    price: number,
    productCategory?: ProductCategoryForm | null
}
