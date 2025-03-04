import { Routes } from '@angular/router';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserFormComponent } from './components/user/user-form/user-form.component';
import { AdjustmentConfigListComponent } from './components/adjustment-config/adjustment-config-list/adjustment-config-list.component';
import { AdjustmentConfigFormComponent } from './components/adjustment-config/adjustment-config-form/adjustment-config-form.component';
import { ProductCategoryListComponent } from './components/product-category/product-category-list/product-category-list.component';
import { ProductCategoryFormComponent } from './components/product-category/product-category-form/product-category-form.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductFormComponent } from './components/product/product-form/product-form.component';

export const routes: Routes = [
    {path: 'user', component: UserListComponent, title: 'Usuarios'},
    {path: 'user/new', component: UserFormComponent, title: 'Nuevo Usuario'},
    {path: 'user/edit/:id', component: UserFormComponent, title: 'Editar Usuario'},
    {path: 'adjustment-config', component: AdjustmentConfigListComponent, title: 'Configuraciones de ajuste de precio'},
    {path: 'adjustment-config/new', component: AdjustmentConfigFormComponent, title: 'Nueva configuración de ajuste de precio'},
    {path: 'product-category', component: ProductCategoryListComponent, title: 'Categorías de producto'},
    {path: 'product-category/new', component: ProductCategoryFormComponent, title: 'Nueva categoría de producto'},
    {path: 'product-category/edit/:id', component: ProductCategoryFormComponent, title: 'Editar categoría de producto'},
    {path: 'product', component: ProductListComponent, title: 'Productos'},
    {path: 'product/new', component: ProductFormComponent, title: 'Nuevo producto'},
    {path: 'product/edit/:id', component: ProductFormComponent, title: 'Editar producto'},   

];
