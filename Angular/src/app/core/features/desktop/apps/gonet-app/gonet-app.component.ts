import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterService, AuthResponse } from './services/register.service';
import { LoginViewComponent } from './views/login-view.component';
import { RegisterViewComponent } from './views/register-view.component';
import { LinkViewComponent } from './views/link-view.component';
import { DashboardViewComponent } from './views/dashboard-view.component';
import { LoadingModalComponent } from './shared/loading-modal.component';

@Component({
  selector: 'app-gonet-app',
  standalone: true,
  imports: [
    CommonModule,
    LoginViewComponent,
    RegisterViewComponent,
    LinkViewComponent,
    DashboardViewComponent,
    LoadingModalComponent
  ],
  template: `
    <div class="gonet-app">

      <app-login-view
        *ngIf="view() === 'login'"
        [error]="error()"
        (switchView)="switchView($event)"
        (errorChange)="error.set($event)"
        (clearErrors)="clearErrors()"
        (login)="onLogin($event)"
      />

      <app-register-view
        *ngIf="view() === 'register'"
        [error]="error()"
        [success]="success()"
        (switchView)="switchView($event)"
        (errorChange)="error.set($event)"
        (successChange)="success.set($event)"
        (clearErrors)="clearErrors()"
        (register)="onRegister($event)"
      />

      <app-link-view
        *ngIf="view() === 'link'"
        [error]="error()"
        [success]="success()"
        (switchView)="switchView($event)"
        (errorChange)="error.set($event)"
        (successChange)="success.set($event)"
        (clearErrors)="clearErrors()"
        (link)="onLink($event)"
      />

      <app-dashboard-view *ngIf="view() === 'dashboard'" />

      <app-loading-modal
        *ngIf="showLoading()"
        [mode]="loadingMode()"
        [progress]="progress()"
        [progressMsgs]="progressMsgs()"
        [loadingSuccess]="loadingSuccess()"
        [loadingError]="loadingError()"
        [elapsedTime]="elapsedTime()"
        (closeModal)="closeLoadingModal()"
      />

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
    :host { display:block; width:100%; height:100%; }
    .gonet-app {
      width:100%; height:100%;
      background:#08080e;
      font-family:'Chakra Petch',sans-serif;
      color:#dcdce4; overflow:hidden;
    }
  `]
})
export class GoNetAppComponent implements OnDestroy {

  view = signal<'login' | 'register' | 'link' | 'dashboard'>('login');

  error = signal('');
  success = signal('');

  showLoading = signal(false);
  loadingMode = signal<'login' | 'register' | 'link'>('login');
  progress = signal(0);
  progressMsgs = signal<string[]>([]);
  loadingSuccess = signal(false);
  loadingError = signal('');
  loadingDone = signal(false);
  elapsedTime = signal(0);

  private elapsedTimer: any;

  constructor(private registerService: RegisterService) {}

  ngOnDestroy(): void {
    clearInterval(this.elapsedTimer);
  }

  clearErrors(): void {
    this.error.set('');
    this.success.set('');
  }

  switchView(target: 'login' | 'register' | 'link' | 'dashboard'): void {
    this.clearErrors();
    this.view.set(target);
  }

  // ══════════════════════════════════════════════════════════════
  //  LOGIN
  // ══════════════════════════════════════════════════════════════
  onLogin(data: { email: string; password: string }): void {
    if (this.showLoading()) return;

    this.loadingMode.set('login');

    this.showLoading.set(true);
    this.progress.set(0);
    this.progressMsgs.set([]);
    this.loadingSuccess.set(false);
    this.loadingError.set('');
    this.loadingDone.set(false);
    this.elapsedTime.set(0);

    this.elapsedTimer = setInterval(() => {
      this.elapsedTime.update(t => +(t + 0.1).toFixed(1));
    }, 100);

    // ─── Pasos temáticos del LOGIN (proceso de autenticación) ───
    const steps = [
      { at: 8,  msg: '> init auth_pipeline --secure' },
      { at: 18, msg: 'Encriptando credenciales (AES-256)...' },
      { at: 28, msg: 'Enviando handshake al servidor...' },
      { at: 40, msg: 'Verificando email en la base de datos...' },
      { at: 52, msg: 'Comparando hash de contrasena (bcrypt)...' },
      { at: 64, msg: 'Validando estado de la cuenta...' },
      { at: 76, msg: 'Generando token de sesion (JWT)...' },
      { at: 88, msg: 'Cargando tu perfil y configuracion...' },
      { at: 96, msg: 'Abriendo tu escritorio GoNET...' },
    ];
    const shownMsgs = new Set<number>();

    let pct = 0;
    let apiDone = false;
    let apiOk = false;
    let apiResult: AuthResponse | null = null;
    let apiErr = '';

    this.registerService.login({
      email: data.email,
      password: data.password
    }).subscribe({
      next: (r) => {
        apiDone = true;
        if (r.success) {
          apiOk = true;
          apiResult = r;
        } else {
          apiOk = false;
          apiErr = r.message || 'Credenciales incorrectas';
        }
      },
      error: (e) => {
        apiDone = true;
        apiOk = false;
        apiErr = e.error?.message || e.error || 'Error al iniciar sesion';
      }
    });

    const tick = () => {
      if (!this.showLoading()) return;

      if (!apiDone) {
        pct += (90 - pct) * 0.035 + 0.12;
        if (pct > 90) pct = 90;
      } else if (apiOk) {
        pct += (100 - pct) * 0.10 + 0.3;
        if (pct > 99.4) pct = 100;
      } else {
        clearInterval(this.elapsedTimer);
        this.loadingDone.set(true);
        this.loadingError.set(apiErr);
        return;
      }

      this.progress.set(Math.round(pct));

      steps.forEach((s, i) => {
        if (pct >= s.at && !shownMsgs.has(i)) {
          shownMsgs.add(i);
          this.progressMsgs.update(m => [...m, s.msg]);
        }
      });

      if (pct >= 100) {
        clearInterval(this.elapsedTimer);
        this.loadingDone.set(true);
        this.loadingSuccess.set(true);

        this.registerService.saveToken(apiResult!.token);
        this.registerService.saveUser(apiResult!);

        setTimeout(() => {
          this.showLoading.set(false);
          this.switchView('dashboard');
        }, 2000);
        return;
      }

      setTimeout(tick, 70 + Math.random() * 40);
    };

    setTimeout(tick, 200);
  }

  // ══════════════════════════════════════════════════════════════
  //  REGISTRO
  // ══════════════════════════════════════════════════════════════
  onRegister(data: {
    username: string; email: string;
    displayName: string; password: string;
    avatarBase64?: string | null;
  }): void {
    if (this.showLoading()) return;

    this.loadingMode.set('register');

    this.showLoading.set(true);
    this.progress.set(0);
    this.progressMsgs.set([]);
    this.loadingSuccess.set(false);
    this.loadingError.set('');
    this.loadingDone.set(false);
    this.elapsedTime.set(0);

    this.elapsedTimer = setInterval(() => {
      this.elapsedTime.update(t => +(t + 0.1).toFixed(1));
    }, 100);

    // ─── Pasos temáticos del REGISTRO (proceso de creación) ───
    const steps = [
      { at: 10, msg: 'Validando datos del formulario...' },
      { at: 24, msg: 'Verificando nombre de usuario...' },
      { at: 38, msg: 'Estableciendo conexion segura...' },
      { at: 52, msg: 'Conectando con el servidor GoNET...' },
      { at: 68, msg: 'Creando tu cuenta...' },
      { at: 82, msg: 'Configurando tu perfil...' },
    ];
    const shownMsgs = new Set<number>();

    let pct = 0;
    let apiDone = false;
    let apiOk = false;
    let apiResult: AuthResponse | null = null;
    let apiErr = '';

    this.registerService.register({
      username: data.username,
      email: data.email,
      displayName: data.displayName,
      password: data.password,
      avatarBase64: data.avatarBase64 ?? undefined
    }).subscribe({
      next: (r) => {
        apiDone = true;
        if (r.success) {
          apiOk = true;
          apiResult = r;
        } else {
          apiOk = false;
          apiErr = r.message || 'Error al crear la cuenta';
        }
      },
      error: (e) => {
        apiDone = true;
        apiOk = false;
        apiErr = e.error?.message || e.error || 'Error al crear la cuenta';
      }
    });

    const tick = () => {
      if (!this.showLoading()) return;

      if (!apiDone) {
        pct += (90 - pct) * 0.035 + 0.12;
        if (pct > 90) pct = 90;
      } else if (apiOk) {
        pct += (100 - pct) * 0.10 + 0.3;
        if (pct > 99.4) pct = 100;
      } else {
        clearInterval(this.elapsedTimer);
        this.loadingDone.set(true);
        this.loadingError.set(apiErr);
        return;
      }

      this.progress.set(Math.round(pct));

      steps.forEach((s, i) => {
        if (pct >= s.at && !shownMsgs.has(i)) {
          shownMsgs.add(i);
          this.progressMsgs.update(m => [...m, s.msg]);
        }
      });

      if (pct >= 100) {
        clearInterval(this.elapsedTimer);
        this.loadingDone.set(true);
        this.loadingSuccess.set(true);

        this.registerService.saveToken(apiResult!.token);
        this.registerService.saveUser(apiResult!);

        setTimeout(() => {
          this.showLoading.set(false);
          this.switchView('login');
        }, 2000);
        return;
      }

      setTimeout(tick, 70 + Math.random() * 40);
    };

    setTimeout(tick, 200);
  }

  // ══════════════════════════════════════════════════════════════
  //  LINK ARCHSGO (login federado / registro por vinculación)
  // ══════════════════════════════════════════════════════════════
  onLink(data: {
    archsGoUsernameOrEmail: string;
    archsGoPassword: string;
    displayName: string;
    avatarBase64?: string | null;
  }): void {
    if (this.showLoading()) return;

    this.loadingMode.set('link');

    this.showLoading.set(true);
    this.progress.set(0);
    this.progressMsgs.set([]);
    this.loadingSuccess.set(false);
    this.loadingError.set('');
    this.loadingDone.set(false);
    this.elapsedTime.set(0);

    this.elapsedTimer = setInterval(() => {
      this.elapsedTime.update(t => +(t + 0.1).toFixed(1));
    }, 100);

    // ─── Pasos temáticos del LINK (proceso de vinculación) ───
    const steps = [
      { at: 10, msg: 'Validando credenciales de ArchsGo...' },
      { at: 25, msg: 'Conectando con ArchsGo API (Go)...' },
      { at: 42, msg: 'Verificando usuario en users_go...' },
      { at: 58, msg: 'Comparando hash bcrypt...' },
      { at: 72, msg: 'Estableciendo vinculacion...' },
      { at: 86, msg: 'Actualizando tu perfil GoNET...' },
      { at: 95, msg: 'Generando token unificado...' },
    ];
    const shownMsgs = new Set<number>();

    let pct = 0;
    let apiDone = false;
    let apiOk = false;
    let apiResult: AuthResponse | null = null;
    let apiErr = '';

    this.registerService.linkArchsGo({
      archsGoUsernameOrEmail: data.archsGoUsernameOrEmail,
      archsGoPassword: data.archsGoPassword,
      displayName: data.displayName,
      avatarBase64: data.avatarBase64 ?? undefined   // ⬅️ NUEVO — reenviar la foto al servicio
    }).subscribe({
      next: (r) => {
        apiDone = true;
        if (r.success) {
          apiOk = true;
          apiResult = r;
        } else {
          apiOk = false;
          apiErr = r.message || 'Error al vincular la cuenta';
        }
      },
      error: (e) => {
        apiDone = true;
        apiOk = false;
        apiErr = e.error?.message || e.error || 'Error al vincular la cuenta';
      }
    });

    const tick = () => {
      if (!this.showLoading()) return;

      if (!apiDone) {
        pct += (90 - pct) * 0.035 + 0.12;
        if (pct > 90) pct = 90;
      } else if (apiOk) {
        pct += (100 - pct) * 0.10 + 0.3;
        if (pct > 99.4) pct = 100;
      } else {
        clearInterval(this.elapsedTimer);
        this.loadingDone.set(true);
        this.loadingError.set(apiErr);
        return;
      }

      this.progress.set(Math.round(pct));

      steps.forEach((s, i) => {
        if (pct >= s.at && !shownMsgs.has(i)) {
          shownMsgs.add(i);
          this.progressMsgs.update(m => [...m, s.msg]);
        }
      });

      if (pct >= 100) {
        clearInterval(this.elapsedTimer);
        this.loadingDone.set(true);
        this.loadingSuccess.set(true);

        // ✅ Refrescar token + usuario (con TieneCuentaArchsGo y avatar nuevo)
        this.registerService.saveToken(apiResult!.token);
        this.registerService.saveUser(apiResult!);

        setTimeout(() => {
          this.showLoading.set(false);
          this.switchView('dashboard');
        }, 2000);
        return;
      }

      setTimeout(tick, 70 + Math.random() * 40);
    };

    setTimeout(tick, 200);
  }

  closeLoadingModal(): void {
    if (!this.loadingDone() && !this.loadingError()) return;
    this.showLoading.set(false);
    clearInterval(this.elapsedTimer);
  }
}