import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private token: string = 'Bearer ';

  constructor(private _httpClient: HttpClient, private _snackBar: MatSnackBar) {
    this.handleError = this.handleError.bind(this)
  }

  updateAuthToken(token) {
    this.token = 'Bearer ' + token
  }

  clearToken() {
    this.token = ''
  }

  async login(username: string, password: string) {
    return await this._httpClient.post(environment.host + '/login', { username, password }).toPromise();
  }

  getTodos() {
    return this._httpClient.get(environment.host + '/todo', this.getHeaders())
      .pipe(
        catchError(this.handleError)
      );;
  }

  createTodo(name: string) {
    return this._httpClient.post(environment.host + '/todo', { name }, this.getHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTodo(todoId: string) {
    return this._httpClient.delete(environment.host + `/todo/${todoId}`, this.getHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  logout() {
    return this._httpClient.post(environment.host + '/logout', {}, this.getHeaders())
      .pipe(
        catchError(this.handleError)
      );
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': this.token
      })
    };
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      this._snackBar.open(`An error occurred: ${error.error.message}`, 'Close', { duration: 5000 });
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      this._snackBar.open(`Server error: ${error.error} (${error.status})`, 'Close', { duration: 5000 });
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
