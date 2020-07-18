import { AuthGuardService } from './../auth-guard.service';
import { TodoService } from './../todo.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-home',
  templateUrl: './todo-home.component.html',
  styleUrls: []
})
export class TodoHomeComponent implements OnInit {
  private error = '';
  user: string;
  sessionTime: number = 0;
  form: FormGroup;
  todos: any[] = []

  constructor(private todoService: TodoService, private fb: FormBuilder, private authGuardService: AuthGuardService, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]]
    });
    this.user = localStorage.getItem('user');
    this.sessionTime = Math.round(authGuardService.getSessiontime() / 1000);
  }

  ngOnInit(): void {
    this.getTodos();
    setInterval(() => {
      this.sessionTime = this.sessionTime - 1;
    }, 1000)
  }

  getTodos() {
    this.todoService.getTodos().subscribe((todos: any[]) => {
      this.todos = todos;
    });
  }

  createTodo() {
    if (this.form.valid) {
      this.todoService.createTodo(this.form.value.name).subscribe((todo: any[]) => {
        this.getTodos()
      });
    }
  }

  deleteTodo(todoId: string) {
    this.todoService.deleteTodo(todoId).subscribe((todo: any[]) => {
      this.getTodos()
    });
  }

  logout() {
    this.todoService.logout().subscribe((todo: any[]) => {
      this.router.navigate(['todo']);
    });
  }
}
