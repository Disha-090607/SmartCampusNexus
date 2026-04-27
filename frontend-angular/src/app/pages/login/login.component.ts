import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="screen auth-screen">
      <section class="panel auth-panel">
        <h1>SmartCampus Nexus</h1>
        <p>Admin panel authentication</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="stack">
          <input *ngIf="mode === 'register'" type="text" placeholder="Name" formControlName="name" />
          <input type="email" placeholder="Email" formControlName="email" />
          <input type="password" placeholder="Password" formControlName="password" />

          <select *ngIf="mode === 'register'" formControlName="role">
            <option value="admin">Admin</option>
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
          </select>

          <button type="submit" [disabled]="loading">
            {{ loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register' }}
          </button>
        </form>

        <button class="ghost" (click)="toggleMode()">
          {{ mode === 'login' ? 'Need account? Register' : 'Already have account? Login' }}
        </button>

        <p class="error" *ngIf="error">{{ error }}</p>
      </section>
    </main>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  mode: 'login' | 'register' = 'login';
  loading = false;
  error = '';

  form = this.fb.nonNullable.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['admin']
  });

  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.error = '';
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const value = this.form.getRawValue();
    const request$ = this.mode === 'login'
      ? this.api.login({ email: value.email, password: value.password })
      : this.api.register({
          name: value.name || 'User',
          email: value.email,
          password: value.password,
          role: value.role || 'admin'
        });

    request$.subscribe({
      next: (data) => {
        localStorage.setItem('scn_token', data.token);
        localStorage.setItem('scn_user', JSON.stringify(data.user));
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.error = err?.error?.message || 'Authentication failed';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
