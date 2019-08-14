import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { format } from 'util';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    const email = authForm.value.email;
    const password = authForm.value.password;
    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      responseData => {
        console.log(responseData);
        this.isLoading = false;
        this.error = null;
        this.router.navigate(['/recipes']);
      },
      error => {
        console.log(error);
        this.error = 'An error occurred!';
        this.isLoading = false;
      }
    );

    authForm.reset();
  }
}
