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

  // Expression régulière pour la complexité du mot de passe
  private strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [
      '',
      [Validators.required, Validators.email]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(this.strongPasswordRegex)
      ]
    ],
    confirm: ['', Validators.required],
  }, {
    validators: (group: any) =>
      group.get('password')?.value === group.get('confirm')?.value
        ? null
        : { notSame: true }
  });

  submit() {
    if (this.form.invalid) {
      if (this.form.get('email')?.invalid) {
        alert("⚠️ L'adresse email n'est pas valide !");
      } 
      else if (this.form.get('password')?.errors?.['pattern']) {
        alert(
          "Mot de passe invalide !\n\n" +
          "Votre mot de passe doit contenir :\n" +
          "• Au moins 8 caractères\n" +
          "• Une majuscule\n" +
          "• Une minuscule\n" +
          "• Un chiffre\n" +
          "• Un caractère spécial (!@#$%^&*)"
        );
      } 
      else if (this.form.errors?.['notSame']) {
        alert("Les mots de passe ne correspondent pas !");
      } 
      else {
        alert("⚠️ Veuillez remplir tous les champs correctement.");
      }

      this.form.markAllAsTouched();
      return;
    }

    const { confirm, ...payload } = this.form.getRawValue() as any;

    const confirmation = window.confirm(
      `Confirmer la création du compte ?\n\nEmail : ${payload.email}\nMot de passe : ${payload.password}`
    );

    if (!confirmation) return;

    this.loading = true;
    this.error = '';

    this.auth.register(payload).subscribe({
      next: () => {
        alert('Compte créé avec succès !');
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        console.error('Erreur d’inscription :', err);
        alert('Erreur : inscription échouée.');
        this.error = 'Inscription échouée.';
        this.loading = false;
      }
    });
  }
}
