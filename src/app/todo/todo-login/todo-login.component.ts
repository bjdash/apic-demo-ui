import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-login',
  templateUrl: './todo-login.component.html',
  styleUrls: [],
})
export class TodoLoginComponent implements OnInit {
  form: FormGroup;
  error: string;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private todoService: TodoService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.maxLength(30)]],
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async submit() {
    console.log(this.form);
    if (this.form.valid) {
      this.error = null;
      try {
        const { username, password } = this.form.value;
        const respData: any = await this.todoService.login(username, password);
        if (respData.token) {
          localStorage.setItem('token', respData.token);
          localStorage.setItem('user', respData.username);
          this.todoService.updateAuthToken(respData.token);
          this.router.navigate(['todo', 'home']);
        } else {
          this.error = 'Login failed';
        }
      } catch (e) {
        console.log(e);
        this.error = e.error.message;
      }
    } else {
      this.error = 'Please enter valid details';
    }
  }

  ngOnInit(): void {}
}
