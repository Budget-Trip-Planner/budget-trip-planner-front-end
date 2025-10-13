import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'bp-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', Validators.required],
  }, { validators: (group:any) =>
        group.get('password')?.value === group.get('confirm')?.value ? null : { notSame: true } });

  loading = false; error = '';

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { confirm, ...payload } = this.form.getRawValue() as any;
    this.loading = true; this.error = '';
    this.auth.register(payload).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: () => { this.error = 'Inscription échouée'; this.loading = false; }
    });
  }
}
