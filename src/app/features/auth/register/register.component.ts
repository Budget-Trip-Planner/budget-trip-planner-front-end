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

  loading = false;
  error = '';

  private strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  form = this.fb.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],          
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.pattern(this.strongPasswordRegex)]],
      confirm: ['', Validators.required],
    },
    {
      validators: (group: any) =>
        group.get('password')?.value === group.get('confirm')?.value
          ? null
          : { notSame: true }
    }
  );

  submit() {
    if (this.form.invalid) {
      if (this.form.get('email')?.invalid) {
        alert("⚠️ L'adresse email n'est pas valide !");
      } else if (this.form.get('password')?.errors?.['pattern']) {
        alert(
          "Mot de passe invalide !\n\n" +
          "• 8+ caractères\n• 1 majuscule\n• 1 minuscule\n• 1 chiffre\n• 1 caractère spécial"
        );
      } else if (this.form.errors?.['notSame']) {
        alert("Les mots de passe ne correspondent pas !");
      } else {
        alert("⚠️ Veuillez remplir tous les champs correctement.");
      }
      this.form.markAllAsTouched();
      return;
    }

    const { confirm, email, ...rest } = this.form.getRawValue() as any;

    // 👉 Map email (UI) -> mail (API)
    const body = {
      ...rest,
      mail: email.trim(),
      username: rest.username.trim(),
      firstName: rest.firstName.trim(),
      lastName: rest.lastName.trim(),
    };

    const ok = window.confirm(
      `Confirmer la création du compte ?\n\nEmail : ${email}\nUsername : ${body.username}`
    );
    if (!ok) return;

    this.loading = true;
    this.error = '';

    this.auth.register(body as any).subscribe({
      next: () => {
        alert('Compte créé avec succès !');
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        console.error('Erreur d’inscription :', err);
        this.error = (err?.error?.message as string) || 'Inscription échouée.';
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }
}
