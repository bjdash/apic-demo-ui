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
  todos: any[] = [];
  flags = {
    adding: false,
    deleting: false,
    getting: false
  }

  constructor(private todoService: TodoService, private fb: FormBuilder, private authGuardService: AuthGuardService, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]]
    });
    this.user = localStorage.getItem('user');
    this.sessionTime = Math.round(authGuardService.getSessiontime() / 1000);
  }

  ngOnInit(): void {
    this.getTodos();
    const intrval = setInterval(() => {
      this.sessionTime = this.sessionTime - 1;
      if (this.sessionTime <= 0) {
        clearInterval(intrval);
        this.router.navigate(['todo']);
      }
    }, 1000)
  }

  getTodos() {
    this.flags.getting = true;
    this.todoService.getTodos().subscribe((todos: any[]) => {
      this.todos = todos;
      this.flags.getting = false;
    });
  }

  createTodo() {
    if (this.form.valid) {
      this.flags.adding = true;
      this.todoService.createTodo(this.form.value.name).subscribe((todo: any[]) => {
        this.flags.adding = false;
        this.getTodos()
      });
    }
  }

  deleteTodo(todoId: string) {
    this.flags.deleting = true;
    this.todoService.deleteTodo(todoId).subscribe((todo: any[]) => {
      this.flags.deleting = false;
      this.getTodos()
    });
  }

  logout() {
    this.todoService.logout().subscribe((todo: any[]) => {
      this.router.navigate(['todo']);
    }, error => {
      this.router.navigate(['todo']);
    });
  }
}
