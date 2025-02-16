import { Routes } from '@angular/router';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserFormComponent } from './components/user/user-form/user-form.component';

export const routes: Routes = [
    {path: 'users', component: UserListComponent, title: 'Usuarios'},
    {path: 'users/new', component: UserFormComponent, title: 'Nuevo Usuario'},
    {path: 'users/edit/:id', component: UserFormComponent, title: 'Editar Usuario'}

];
