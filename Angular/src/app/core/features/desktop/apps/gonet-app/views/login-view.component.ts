import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormFieldComponent } from '../shared/form-field.component';
import { ParticleCanvasComponent } from '../shared/particle-canvas.component';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [CommonModule, FormsModule, FormFieldComponent, ParticleCanvasComponent],
  template: `
    <div class="gn-page">
      <div class="gn-split">

        <div class="gn-left">
          <app-particle-canvas mode="nodes"></app-particle-canvas>
          <div class="gn-login-orb login-orb-red"></div>
          <div class="gn-login-orb login-orb-blue"></div>
          <div class="gn-login-orb login-orb-pink"></div>
          <div class="gn-orbit-system">
            <div class="gn-orbit orbit-1"></div>
            <div class="gn-orbit orbit-2"></div>
            <div class="gn-orbit orbit-3"></div>
          </div>
          <div class="gn-left-center">
            <div class="gn-logo-wrap">
              <div class="gn-logo-glow"></div>
              <svg class="gn-logo" viewBox="0 0 80 80" fill="none">
                <defs>
                  <linearGradient id="lgMain" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#DD0031"/><stop offset="100%" stop-color="#1793D1"/>
                  </linearGradient>
                  <linearGradient id="lgVert" x1="40" y1="6" x2="40" y2="74" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#DD0031"/><stop offset="40%" stop-color="#c02070"/><stop offset="100%" stop-color="#1793D1"/>
                  </linearGradient>
                  <filter id="lgGlow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  <clipPath id="lgClip"><circle cx="40" cy="40" r="36"/></clipPath>
                </defs>
                <circle cx="40" cy="40" r="37" fill="#0a0a12"/>
                <circle cx="40" cy="40" r="37" fill="none" stroke="#DD0031" stroke-width="3" stroke-dasharray="46 28" stroke-linecap="round" opacity="0.9">
                  <animateTransform attributeName="transform" type="rotate" values="0 40 40;360 40 40" dur="20s" repeatCount="indefinite"/>
                </circle>
                <circle cx="40" cy="40" r="37" fill="none" stroke="#DD0031" stroke-width="3" stroke-dasharray="46 28" stroke-dashoffset="-74" stroke-linecap="round" opacity="0.6">
                  <animateTransform attributeName="transform" type="rotate" values="0 40 40;-360 40 40" dur="25s" repeatCount="indefinite"/>
                </circle>
                <circle cx="40" cy="40" r="37" fill="none" stroke="#1793D1" stroke-width="3" stroke-dasharray="46 28" stroke-dashoffset="-148" stroke-linecap="round" opacity="0.9">
                  <animateTransform attributeName="transform" type="rotate" values="0 40 40;360 40 40" dur="15s" repeatCount="indefinite"/>
                </circle>
                <circle cx="40" cy="6" r="4" fill="#DD0031" filter="url(#lgGlow)"/>
                <circle cx="10" cy="60" r="4" fill="#DD0031" opacity="0.7"/>
                <circle cx="70" cy="60" r="4" fill="#1793D1" opacity="0.7"/>
                <g clip-path="url(#lgClip)">
                  <path d="M40 12 L64 64 L16 64 Z" fill="none" stroke="url(#lgVert)" stroke-width="2.5" opacity="0.8"/>
                  <path d="M40 24 L54 60 L26 60 Z" fill="url(#lgVert)" opacity="0.15"/>
                  <path d="M40 70 L40 12" stroke="url(#lgMain)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
                  <path d="M32 30 L40 12 L48 30" stroke="#DD0031" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9" filter="url(#lgGlow)"/>
                </g>
                <circle cx="40" cy="12" r="2" fill="#fff" opacity="0.3"><animate attributeName="opacity" values="0.1;0.5;0.1" dur="3s" repeatCount="indefinite"/></circle>
              </svg>
            </div>
            <h1 class="gn-left-title"><span class="gn-t-red">Go</span><span class="gn-t-blue">NET</span></h1>
            <p class="gn-left-sub">Chat en tiempo real</p>
            <p class="gn-left-desc">Comunicate con tu equipo de desarrollo en tiempo real. Seguro, rapido y simple.</p>
            <div class="gn-status-dots">
              <div class="gn-dot dot-red"></div>
              <div class="gn-dot dot-pink"></div>
              <div class="gn-dot dot-blue"></div>
            </div>
          </div>
        </div>

        <div class="gn-right">
          <div class="gn-right-inner">
            <h2 class="gn-h2">Iniciar sesion</h2>
            <p class="gn-sub">Accede a tu cuenta de GoNET</p>
            <div class="gn-form">
              <app-form-field
                label="Email o usuario"
                placeholder="usuario&#64;correo.com"
                [model]="loginUser"
                (modelChange)="loginUser = $event"
                [spellcheck]="false"
                [iconPath]="userIcon"
              />
              <app-form-field
                label="Contrasena"
                placeholder="Tu contrasena"
                [type]="showPwd() ? 'text' : 'password'"
                [model]="loginPass"
                (modelChange)="loginPass = $event"
                [iconPath]="lockIcon"
              />
              <div class="gn-error" *ngIf="error">{{ error }}</div>
              <button class="gn-btn gn-btn-primary" (click)="onLogin()">Iniciar sesion</button>
            </div>
            <div class="gn-divider"><div class="gn-div-line"></div><span>o continua con</span><div class="gn-div-line"></div></div>
            <div class="gn-actions">
              <button class="gn-btn gn-btn-create" (click)="clearErrors.emit(); switchView.emit('register')">
                Crear cuenta nueva
              </button>
              <button class="gn-btn gn-btn-link" (click)="clearErrors.emit(); switchView.emit('link')">
                Vincular cuenta de ArchsGo
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .gn-page { width:100%; height:100%; animation:gnFadeIn 0.4s cubic-bezier(0.16,1,0.3,1); }
    @keyframes gnFadeIn { from { opacity:0; } to { opacity:1; } }
    .gn-split { display:flex; width:100%; height:100%; }
    .gn-left { flex:0 0 40%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 32px; position:relative; overflow:hidden; border-right:1px solid rgba(255,255,255,0.05); background:#04040a; }
    .gn-right { flex:1; display:flex; align-items:center; justify-content:center; padding:32px 48px; overflow-y:auto; }
    .gn-right-inner { width:100%; max-width:480px; display:flex; flex-direction:column; animation:gnSlide 0.5s cubic-bezier(0.16,1,0.3,1); }
    @keyframes gnSlide { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
    .gn-left-center { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; width:100%; position:relative; z-index:10; }
    .gn-logo-wrap { position:relative; width:140px; height:140px; margin-bottom:28px; z-index:1; animation:logoBreath 5s ease-in-out infinite; }
    @keyframes logoBreath { 0%,100% { transform:scale(1); } 50% { transform:scale(1.04); } }
    .gn-logo-glow { position:absolute; inset:-50px; border-radius:50%; background:radial-gradient(circle, rgba(221,0,49,0.15) 0%, rgba(192,32,112,0.08) 40%, rgba(23,147,209,0.06) 70%, transparent); filter:blur(25px); animation:gnGlow 3s ease-in-out infinite alternate; }
    @keyframes gnGlow { 0% { opacity:0.4; } 100% { opacity:1; } }
    .gn-logo { width:100%; height:100%; filter:drop-shadow(0 0 25px rgba(221,0,49,0.2)) drop-shadow(0 0 25px rgba(23,147,209,0.15)); }
    .gn-left-title { font-size:44px; font-weight:700; letter-spacing:8px; margin-bottom:8px; z-index:1; text-shadow:0 0 40px rgba(221,0,49,0.15), 0 0 40px rgba(23,147,209,0.1); animation:titlePulse 4s ease-in-out infinite; }
    @keyframes titlePulse { 0%,100% { text-shadow:0 0 40px rgba(221,0,49,0.15), 0 0 40px rgba(23,147,209,0.1); } 50% { text-shadow:0 0 60px rgba(221,0,49,0.25), 0 0 60px rgba(23,147,209,0.15); } }
    .gn-left-sub { font-family:'JetBrains Mono',monospace; font-size:12px; color:#555; letter-spacing:4px; text-transform:uppercase; margin-bottom:16px; z-index:1; }
    .gn-left-desc { font-size:13px; color:#444; text-align:center; line-height:1.7; max-width:260px; z-index:1; }
    .gn-t-red { background:linear-gradient(135deg,#DD0031,#ff1a4a); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .gn-t-blue { background:linear-gradient(135deg,#1793D1,#38b6f0); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .gn-status-dots { display:flex; gap:8px; margin-top:20px; z-index:1; }
    .gn-dot { width:6px; height:6px; border-radius:50%; animation:dotPulse 2s ease-in-out infinite; }
    .dot-red { background:#DD0031; animation-delay:0s; }
    .dot-pink { background:#c02070; animation-delay:0.4s; }
    .dot-blue { background:#1793D1; animation-delay:0.8s; }
    @keyframes dotPulse { 0%,100% { opacity:0.3; transform:scale(1); } 50% { opacity:1; transform:scale(1.3); box-shadow:0 0 8px currentColor; } }
    .gn-login-orb { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; z-index:2; }
    .login-orb-red { width:280px; height:280px; background:radial-gradient(circle, rgba(221,0,49,0.13), transparent 70%); top:-60px; right:-80px; animation:loginOrbA 15s ease-in-out infinite; }
    .login-orb-blue { width:260px; height:260px; background:radial-gradient(circle, rgba(23,147,209,0.1), transparent 70%); bottom:-80px; left:-60px; animation:loginOrbB 18s ease-in-out infinite; }
    .login-orb-pink { width:180px; height:180px; background:radial-gradient(circle, rgba(192,32,112,0.08), transparent 70%); top:50%; left:50%; transform:translate(-50%,-50%); animation:loginOrbC 12s ease-in-out infinite; }
    @keyframes loginOrbA { 0%,100% { transform:translate(0,0) scale(1); } 25% { transform:translate(-30px,40px) scale(1.1); } 50% { transform:translate(20px,60px) scale(0.95); } 75% { transform:translate(-10px,20px) scale(1.05); } }
    @keyframes loginOrbB { 0%,100% { transform:translate(0,0) scale(1); } 25% { transform:translate(40px,-30px) scale(1.08); } 50% { transform:translate(-20px,-50px) scale(0.92); } 75% { transform:translate(10px,-15px) scale(1.03); } }
    @keyframes loginOrbC { 0%,100% { transform:translate(-50%,-50%) scale(1); opacity:0.6; } 50% { transform:translate(-50%,-50%) scale(1.4); opacity:1; } }
    .gn-orbit-system { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); z-index:2; pointer-events:none; }
    .gn-orbit { position:absolute; border-radius:50%; border:1px solid transparent; top:50%; left:50%; transform:translate(-50%,-50%); }
    .orbit-1 { width:280px; height:280px; border-color:rgba(221,0,49,0.08); animation:orbitSpin 30s linear infinite; }
    .orbit-1::after { content:''; position:absolute; width:6px; height:6px; background:#DD0031; border-radius:50%; top:-3px; left:50%; transform:translateX(-50%); box-shadow:0 0 12px rgba(221,0,49,0.5); }
    .orbit-2 { width:200px; height:200px; border-color:rgba(192,32,112,0.06); animation:orbitSpin 22s linear infinite reverse; }
    .orbit-2::after { content:''; position:absolute; width:5px; height:5px; background:#c02070; border-radius:50%; bottom:-2.5px; left:50%; transform:translateX(-50%); box-shadow:0 0 10px rgba(192,32,112,0.4); }
    .orbit-3 { width:130px; height:130px; border-color:rgba(23,147,209,0.08); animation:orbitSpin 16s linear infinite; }
    .orbit-3::after { content:''; position:absolute; width:4px; height:4px; background:#1793D1; border-radius:50%; top:-2px; left:50%; transform:translateX(-50%); box-shadow:0 0 10px rgba(23,147,209,0.5); }
    @keyframes orbitSpin { from { transform:translate(-50%,-50%) rotate(0deg); } to { transform:translate(-50%,-50%) rotate(360deg); } }
    .gn-h2 { font-size:26px; font-weight:600; letter-spacing:1px; margin-bottom:6px; color:#e8e8f0; }
    .gn-sub { font-size:14px; color:#666; margin-bottom:24px; }
    .gn-form { width:100%; display:flex; flex-direction:column; gap:16px; }
    .gn-error { padding:12px 16px; background:rgba(221,0,49,0.06); border:1px solid rgba(221,0,49,0.2); border-left:3px solid #DD0031; border-radius:8px; font-size:13px; color:#DD0031; font-family:'JetBrains Mono',monospace; }
    .gn-btn { display:flex; align-items:center; justify-content:center; gap:10px; padding:16px; border:none; border-radius:10px; font-family:'Chakra Petch',sans-serif; font-size:14px; font-weight:600; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.25s; width:100%; }
    .gn-btn:active { transform:scale(0.98); }
    .gn-btn-primary { background:linear-gradient(135deg,#DD0031,#c02070,#1793D1); background-size:200% 200%; animation:gnGrad 4s ease infinite; color:#fff; }
    @keyframes gnGrad { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
    .gn-btn-primary:hover { box-shadow:0 8px 30px rgba(221,0,49,0.3), 0 0 40px rgba(23,147,209,0.1); transform:translateY(-2px); }
    .gn-btn-create { background:rgba(221,0,49,0.06); border:1px solid rgba(221,0,49,0.2); color:#DD0031; }
    .gn-btn-create:hover { background:rgba(221,0,49,0.12); border-color:rgba(221,0,49,0.4); box-shadow:0 4px 20px rgba(221,0,49,0.1); }
    .gn-btn-link { background:rgba(23,147,209,0.06); border:1px solid rgba(23,147,209,0.2); color:#1793D1; }
    .gn-btn-link:hover { background:rgba(23,147,209,0.12); border-color:rgba(23,147,209,0.4); box-shadow:0 4px 20px rgba(23,147,209,0.1); }
    .gn-divider { display:flex; align-items:center; gap:16px; width:100%; margin:20px 0; }
    .gn-div-line { flex:1; height:1px; background:rgba(255,255,255,0.06); }
    .gn-divider span { font-size:11px; color:#444; text-transform:uppercase; letter-spacing:2px; white-space:nowrap; }
    .gn-actions { width:100%; display:flex; flex-direction:column; gap:12px; }
    @media (max-width:700px) {
      .gn-split { flex-direction:column; }
      .gn-left { flex:0 0 auto; padding:24px 20px; border-right:none; border-bottom:1px solid rgba(255,255,255,0.05); }
      .gn-logo-wrap { width:100px; height:100px; margin-bottom:16px; }
      .gn-left-title { font-size:28px; letter-spacing:4px; }
      .gn-left-sub { font-size:10px; margin-bottom:8px; }
      .gn-left-desc { font-size:11px; max-width:200px; }
      .gn-right { padding:20px 24px; }
      .gn-right-inner { max-width:100%; }
      .gn-h2 { font-size:22px; }
      .gn-sub { font-size:12px; margin-bottom:16px; }
      .gn-btn { padding:14px; font-size:13px; }
      .orbit-1 { width:180px; height:180px; }
      .orbit-2 { width:130px; height:130px; }
      .orbit-3 { width:80px; height:80px; }
      .login-orb-red, .login-orb-blue { width:160px; height:160px; }
      .login-orb-pink { width:100px; height:100px; }
    }
  `]
})
export class LoginViewComponent {
  @Input() error = '';
  @Output() switchView = new EventEmitter<'register' | 'link'>();
  @Output() errorChange = new EventEmitter<string>();
  @Output() clearErrors = new EventEmitter<void>();
  @Output() login = new EventEmitter<{ email: string; password: string }>();

  showPwd = signal(false);
  loginUser = '';
  loginPass = '';

  userIcon = '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>';
  lockIcon = '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>';

  onLogin(): void {
    this.clearErrors.emit();
    if (!this.loginUser.trim()) { this.errorChange.emit('Ingresa tu email o usuario'); return; }
    if (!this.loginPass) { this.errorChange.emit('Ingresa tu contrasena'); return; }
    this.login.emit({
      email: this.loginUser.trim(),
      password: this.loginPass
    });
  }
}