import { Routes } from '@angular/router';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserFormComponent } from './components/user/user-form/user-form.component';
import { AdjustmentConfigListComponent } from './components/adjustment-config/adjustment-config-list/adjustment-config-list.component';
import { AdjustmentConfigFormComponent } from './components/adjustment-config/adjustment-config-form/adjustment-config-form.component';

export const routes: Routes = [
    {path: 'user', component: UserListComponent, title: 'Usuarios'},
    {path: 'user/new', component: UserFormComponent, title: 'Nuevo Usuario'},
    {path: 'user/edit/:id', component: UserFormComponent, title: 'Editar Usuario'},
    {path: 'adjustment-config', component: AdjustmentConfigListComponent, title: 'Configuraciones de ajuste de precio'},
    {path: 'adjustment-config/new', component: AdjustmentConfigFormComponent, title: 'Nueva configuración de ajuste de precio'}

];
