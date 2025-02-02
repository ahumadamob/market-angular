import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailsComponent } from './components/details/details.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserFormComponent } from './components/user/user-form/user-form.component';

export const routes: Routes = [
    {path: 'details/:id', component: DetailsComponent, title: 'Home Details'},
    {path: 'users', component: UserListComponent, title: 'Usuarios'},
    {path: 'users/new', component: UserFormComponent, title: 'Nuevo Usuario'},
    {path: 'users/edit/:id', component: UserFormComponent, title: 'Editar Usuario'}

];
