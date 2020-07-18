import { AuthGuardService } from './todo/auth-guard.service';
import { TodoHomeComponent } from './todo/todo-home/todo-home.component';
import { TodoLoginComponent } from './todo/todo-login/todo-login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoComponent } from './todo/todo.component';


const routes: Routes = [
  { path: '', redirectTo: 'todo', pathMatch: 'full' },
  // { path: '**', redirectTo: 'todo' },
  {
    path: 'todo',
    component: TodoComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: "login", component: TodoLoginComponent },
      { path: "home", component: TodoHomeComponent, canActivate: [AuthGuardService] },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
