import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RegisterStateService {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;

  showPwd = signal(false);
  showConfirm = signal(false);
  loading = signal(false);
  showModal = signal(false);
  modalStep = signal(0);
  modalProgress = signal(0);

  errUsername = signal('');
  errEmail = signal('');
  errPassword = signal('');
  errConfirm = signal('');
  errGeneral = signal('');

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  get ruleLength(): boolean { return this.password.length >= 8; }
  get ruleUppercase(): boolean { return /[A-Z]/.test(this.password); }
  get ruleNumbers(): boolean { return ((this.password.match(/[0-9]/g) || []).length) >= 2; }
  get ruleSpecial(): boolean { return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(this.password); }
  get lengthProgress(): number { return Math.min((this.password.length / 8) * 100, 100); }
  get numbersProgress(): number { return Math.min(((this.password.match(/[0-9]/g) || []).length / 2) * 100, 100); }
  get strength(): number { let s = 0; if (this.ruleLength) s++; if (this.ruleUppercase) s++; if (this.ruleNumbers) s++; if (this.ruleSpecial) s++; return s; }
  get strengthLabel(): string { return ['','D\u00e9bil','Media','Fuerte','Excelente'][this.strength]; }

  passwordsMatch(): boolean { return this.password.length > 0 && this.password === this.confirmPassword; }

  canSubmit(): boolean {
    return (
      this.username.trim().length > 0 &&
      this.email.trim().length > 0 &&
      this.ruleLength &&
      this.ruleUppercase &&
      this.ruleNumbers &&
      this.ruleSpecial &&
      this.passwordsMatch() &&
      this.acceptTerms
    );
  }

  clearErrors(): void {
    this.errUsername.set('');
    this.errEmail.set('');
    this.errPassword.set('');
    this.errConfirm.set('');
    this.errGeneral.set('');
  }

  validateFields(): boolean {
    this.clearErrors();
    let valid = true;

    if (this.username.trim().length === 0) {
      this.errUsername.set('El nombre de usuario es requerido');
      valid = false;
    } else if (this.username.trim().length < 3) {
      this.errUsername.set('El nombre debe tener al menos 3 caracteres');
      valid = false;
    } else if (this.username.trim().length > 50) {
      this.errUsername.set('El nombre no puede superar 50 caracteres');
      valid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(this.username.trim())) {
      this.errUsername.set('Solo letras, numeros y guion bajo');
      valid = false;
    }

    if (this.email.trim().length === 0) {
      this.errEmail.set('El email es requerido');
      valid = false;
    } else if (!this.email.includes('@') || !this.email.includes('.')) {
      this.errEmail.set('Formato de email invalido');
      valid = false;
    } else if (this.email.trim().length > 100) {
      this.errEmail.set('El email no puede superar 100 caracteres');
      valid = false;
    }

    if (this.password.length === 0) {
      this.errPassword.set('La contrase\u00f1a es requerida');
      valid = false;
    } else if (!this.ruleLength) {
      this.errPassword.set('Debe tener al menos 8 caracteres');
      valid = false;
    } else if (!this.ruleUppercase) {
      this.errPassword.set('Debe contener al menos 1 mayuscula');
      valid = false;
    } else if (!this.ruleNumbers) {
      this.errPassword.set('Debe contener al menos 2 numeros');
      valid = false;
    } else if (!this.ruleSpecial) {
      this.errPassword.set('Debe contener al menos 1 caracter especial');
      valid = false;
    }

    if (this.confirmPassword.length === 0) {
      this.errConfirm.set('Confirma tu contrase\u00f1a');
      valid = false;
    } else if (!this.passwordsMatch()) {
      this.errConfirm.set('Las contrase\u00f1as no coinciden');
      valid = false;
    }

    if (!this.acceptTerms) {
      this.errGeneral.set('Debes aceptar los terminos y condiciones');
      valid = false;
    }

    return valid;
  }

  onRegister(): void {
    if (this.loading()) return;
    if (!this.validateFields()) return;

    this.loading.set(true);
    this.showModal.set(true);
    this.modalStep.set(0);
    this.modalProgress.set(0);

    setTimeout(() => { this.modalStep.set(1); this.modalProgress.set(25); }, 500);
    setTimeout(() => { this.modalStep.set(2); this.modalProgress.set(50); }, 1200);

    setTimeout(() => {
      this.http.post<any>(`${this.apiUrl}/register`, {
        username: this.username.trim(),
        email: this.email.trim().toLowerCase(),
        password: this.password
      }).subscribe({
        next: () => {
          this.modalStep.set(3);
          this.modalProgress.set(75);
          setTimeout(() => { this.modalStep.set(4); this.modalProgress.set(100); }, 800);
          setTimeout(() => { this.router.navigate(['/login']); }, 1500);
        },
        error: (err) => {
          this.showModal.set(false);
          this.loading.set(false);
          const msg = err.error?.error || 'Error al crear la cuenta';

          if (msg.toLowerCase().includes('usuario') && msg.toLowerCase().includes('email')) {
            this.errGeneral.set('El usuario o email ya esta registrado');
          } else if (msg.toLowerCase().includes('username') || msg.toLowerCase().includes('usuario')) {
            this.errUsername.set('Este nombre de usuario ya esta en uso');
          } else if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('correo')) {
            this.errEmail.set('Este email ya esta registrado');
          } else if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('contrase')) {
            this.errPassword.set(msg);
          } else {
            this.errGeneral.set(msg);
          }
        }
      });
    }, 1800);
  }
}