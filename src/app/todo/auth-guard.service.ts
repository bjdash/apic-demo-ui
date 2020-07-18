import { TodoService } from './todo.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private todoService: TodoService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isTokenValid()) {
      this.todoService.updateAuthToken(localStorage.token);
      return true
    } else {
      this.router.navigate(['todo']);
      return false
    }

  }

  isTokenValid(): boolean {
    if (localStorage.token) {
      const decoded = jwt_decode(localStorage.token);

      if (decoded.exp === undefined) return false;

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);

      return date.valueOf() > new Date().valueOf();
    }
    return false;
  }

  getSessiontime(): number {
    if (localStorage.token) {
      const decoded = jwt_decode(localStorage.token);

      if (decoded.exp === undefined) return 0;

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);

      return date.valueOf() - new Date().valueOf();
    }
    return 0;
  }
}
