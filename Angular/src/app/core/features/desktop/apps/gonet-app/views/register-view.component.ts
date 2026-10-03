import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormFieldComponent } from '../shared/form-field.component';
import { AvatarUploaderComponent } from '../shared/avatar-uploader.component';

@Component({
  selector: 'app-register-view',
  standalone: true,
  imports: [CommonModule, FormsModule, FormFieldComponent, AvatarUploaderComponent],
  template: `
    <div class="gn-page">
      <div class="gn-split">

        <div class="gn-left">
          <button class="gn-back-corner" (click)="clearErrors.emit(); switchView.emit('login')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Volver al login
          </button>
          <div class="gn-left-glow g1"></div>
          <div class="gn-left-glow g2"></div>
          <div class="gn-left-center">
            <div class="gn-logo-wrap">
              <div class="gn-logo-glow"></div>
              <svg class="gn-logo" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="fuRed" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#DD0031"/><stop offset="100%" stop-color="#ff1a4a"/></linearGradient>
                  <linearGradient id="fuCyan" x1="100" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#1793D1"/><stop offset="100%" stop-color="#38b6f0"/></linearGradient>
                  <linearGradient id="fuMix" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#DD0031"/><stop offset="35%" stop-color="#c02070"/><stop offset="65%" stop-color="#8040a0"/><stop offset="100%" stop-color="#1793D1"/></linearGradient>
                  <filter id="fuGlow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  <clipPath id="fuClip"><circle cx="50" cy="50" r="44"/></clipPath>
                </defs>
                <circle cx="50" cy="50" r="47" fill="#060608"/><circle cx="50" cy="50" r="47" fill="none" stroke="url(#fuMix)" stroke-width="1.5" opacity="0.4"/>
                <g clip-path="url(#fuClip)" opacity="0.9">
                  <path d="M30 18 L50 8 L50 50 L30 62 Z" fill="url(#fuRed)" opacity="0.7" filter="url(#fuGlow)"/>
                  <path d="M30 18 L30 62 L50 50 L50 8 Z" fill="url(#fuRed)" opacity="0.5"/>
                  <path d="M30 62 L50 50 L30 18 L14 34 Z" fill="#DD0031" opacity="0.3"/>
                  <path d="M30 62 L50 50 L14 74 Z" fill="#a01030" opacity="0.4"/>
                </g>
                <g clip-path="url(#fuClip)" opacity="0.9">
                  <path d="M50 8 L76 20 L84 44 L76 68 L58 80 L50 50 Z" fill="url(#fuCyan)" opacity="0.6" filter="url(#fuGlow)"/>
                  <path d="M76 20 L90 12 L84 28 L76 20 Z" fill="#1793D1" opacity="0.7"/>
                  <path d="M76 68 L92 72 L84 58 L76 68 Z" fill="#1793D1" opacity="0.5"/>
                  <path d="M68 44 L86 38" stroke="#1793D1" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
                  <path d="M72 56 L88 54" stroke="#1793D1" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
                  <path d="M50 8 L76 20 L50 50 Z" fill="#0a3050" opacity="0.3"/>
                </g>
                <g clip-path="url(#fuClip)">
                  <path d="M50 8 L50 92" stroke="url(#fuMix)" stroke-width="2" opacity="0.6" filter="url(#fuGlow)"/>
                  <circle cx="50" cy="50" r="12" fill="none" stroke="url(#fuMix)" stroke-width="1.5" opacity="0.5"><animate attributeName="r" values="10;14;10" dur="3s" repeatCount="indefinite"/></circle>
                  <circle cx="50" cy="50" r="6" fill="#060608" stroke="url(#fuMix)" stroke-width="2" opacity="0.9"/>
                  <circle cx="50" cy="50" r="2.5" fill="url(#fuMix)" opacity="0.8"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/></circle>
                  <circle cx="48" cy="48" r="1" fill="#fff" opacity="0.6"/>
                </g>
                <circle cx="50" cy="8" r="2.5" fill="#DD0031" filter="url(#fuGlow)"><animate attributeName="r" values="2;3;2" dur="2.5s" repeatCount="indefinite"/></circle>
                <circle cx="14" cy="74" r="2" fill="#DD0031" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/></circle>
                <circle cx="90" cy="12" r="2" fill="#1793D1" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.5s" begin="1s" repeatCount="indefinite"/></circle>
                <circle cx="92" cy="72" r="2" fill="#1793D1" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.8s" begin="0.5s" repeatCount="indefinite"/></circle>
                <circle cx="50" cy="8" r="1.5" fill="#fff" opacity="0.2"><animate attributeName="opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/></circle>
              </svg>
            </div>
            <h1 class="gn-left-title"><span class="gn-t-red">Go</span><span class="gn-t-blue">NET</span></h1>
            <p class="gn-left-sub">Crea tu cuenta</p>
            <p class="gn-left-desc">Unete a la comunidad de GoNET y empieza a comunicarte con tu equipo.</p>
          </div>
        </div>

        <div class="gn-right">
          <div class="gn-right-inner">
            <h2 class="gn-h2">Crear cuenta</h2>
            <p class="gn-sub">Crea tu cuenta independiente en GoNET</p>
            <div class="gn-form">
              <app-avatar-uploader [preview]="regAvatarPreview" (previewChange)="onRegAvatarPreview($event)" (errorChange)="onAvatarError($event)"/>
              <div class="gn-grid-2">
                <app-form-field label="Nombre de usuario" placeholder="Tu usuario" [model]="regUser" (modelChange)="regUser = $event" [spellcheck]="false"
                  [iconPath]="userIcon"/>
                <app-form-field label="Email" type="email" placeholder="tu&#64;correo.com" [model]="regEmail" (modelChange)="regEmail = $event"
                  [iconPath]="emailIcon"/>
              </div>
              <app-form-field label="Nombre para mostrar" placeholder="Como te van a ver los demas" [model]="regDisplay" (modelChange)="regDisplay = $event"
                [iconPath]="editIcon"/>
              <div class="gn-grid-2">
                <app-form-field label="Contrasena" placeholder="Tu contrasena" [type]="showPwd() ? 'text' : 'password'" [model]="regPass()" (modelChange)="regPass.set($event)"
                  [iconPath]="lockIcon"/>
                <app-form-field label="Confirmar contrasena" placeholder="Repite la contrasena" [type]="showPwd() ? 'text' : 'password'" [model]="regPassConfirm()" (modelChange)="regPassConfirm.set($event)"
                  [iconPath]="lockIcon"/>
              </div>

              <!-- Barra de fortaleza + checklist de requisitos (reactivo a cada tecla) -->
              <div class="gn-pwd-checker" *ngIf="regPass().length > 0">
                <div class="gn-pwd-bar-track">
                  <div class="gn-pwd-bar-fill" [style.width.%]="pwdStrength()" [class.strength-ok]="pwdStrength() === 100"></div>
                </div>
                <div class="gn-pwd-reqs">
                  <div class="gn-pwd-req" [class.req-ok]="pwdReqs().length" [class.req-bad]="!pwdReqs().length">
                    <span class="req-icon">{{ pwdReqs().length ? '✓' : '○' }}</span>
                    <span>Minimo 6 caracteres</span>
                  </div>
                  <div class="gn-pwd-req" [class.req-ok]="pwdReqs().upper" [class.req-bad]="!pwdReqs().upper">
                    <span class="req-icon">{{ pwdReqs().upper ? '✓' : '○' }}</span>
                    <span>Una mayuscula</span>
                  </div>
                  <div class="gn-pwd-req" [class.req-ok]="pwdReqs().number" [class.req-bad]="!pwdReqs().number">
                    <span class="req-icon">{{ pwdReqs().number ? '✓' : '○' }}</span>
                    <span>Un numero</span>
                  </div>
                  <div class="gn-pwd-req" [class.req-ok]="pwdReqs().specials" [class.req-bad]="!pwdReqs().specials">
                    <span class="req-icon">{{ pwdReqs().specials ? '✓' : '○' }}</span>
                    <span>Dos caracteres especiales (!&#64;#$%...)</span>
                  </div>
                </div>
              </div>

              <div class="gn-error" *ngIf="error">{{ error }}</div>
              <div class="gn-success" *ngIf="success">{{ success }}</div>
              <button class="gn-btn gn-btn-primary gn-btn-lg" (click)="onRegister()">Crear cuenta</button>
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
    .gn-left { flex:0 0 40%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 32px; position:relative; overflow:hidden; border-right:1px solid rgba(255,255,255,0.05); background:rgba(6,6,10,0.8); }
    .gn-left-glow { position:absolute; border-radius:50%; pointer-events:none; filter:blur(60px); }
    .g1 { width:200px; height:200px; top:-40px; left:-40px; background:rgba(221,0,49,0.08); animation:glowA 8s ease-in-out infinite alternate; }
    .g2 { width:250px; height:250px; bottom:-60px; right:-40px; background:rgba(23,147,209,0.06); animation:glowA 10s ease-in-out infinite alternate-reverse; }
    @keyframes glowA { 0% { opacity:0.5; } 100% { opacity:1; } }
    .gn-left-center { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; width:100%; position:relative; }
    .gn-right { flex:1; display:flex; align-items:center; justify-content:center; padding:32px 48px; overflow-y:auto; }
    .gn-right-inner { width:100%; max-width:480px; display:flex; flex-direction:column; animation:gnSlide 0.5s cubic-bezier(0.16,1,0.3,1); }
    @keyframes gnSlide { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
    .gn-logo-wrap { position:relative; width:120px; height:120px; margin-bottom:24px; z-index:1; }
    .gn-logo-glow { position:absolute; inset:-40px; border-radius:50%; background:radial-gradient(circle, rgba(221,0,49,0.08) 0%, rgba(23,147,209,0.06) 50%, transparent 70%); filter:blur(25px); animation:gnGlow 4s ease-in-out infinite alternate; }
    @keyframes gnGlow { 0% { opacity:0.4; } 100% { opacity:1; } }
    .gn-logo { width:100%; height:100%; filter:drop-shadow(0 0 25px rgba(221,0,49,0.2)) drop-shadow(0 0 25px rgba(23,147,209,0.15)); }
    .gn-left-title { font-size:44px; font-weight:700; letter-spacing:8px; margin-bottom:8px; z-index:1; }
    .gn-left-sub { font-family:'JetBrains Mono',monospace; font-size:12px; color:#555; letter-spacing:4px; text-transform:uppercase; margin-bottom:16px; z-index:1; }
    .gn-left-desc { font-size:13px; color:#444; text-align:center; line-height:1.7; max-width:260px; z-index:1; }
    .gn-t-red { background:linear-gradient(135deg,#DD0031,#ff1a4a); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .gn-t-blue { background:linear-gradient(135deg,#1793D1,#38b6f0); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .gn-back-corner { position:absolute; top:12px; left:16px; display:flex; align-items:center; gap:6px; background:rgba(0,0,0,0.3); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.06); border-radius:8px; color:#777; font-family:'Chakra Petch',sans-serif; font-size:12px; font-weight:500; padding:8px 14px; cursor:pointer; transition:all 0.25s; z-index:20; }
    .gn-back-corner:hover { color:#DD0031; border-color:rgba(221,0,49,0.3); background:rgba(221,0,49,0.08); }
    .gn-h2 { font-size:26px; font-weight:600; letter-spacing:1px; margin-bottom:6px; color:#e8e8f0; }
    .gn-sub { font-size:14px; color:#666; margin-bottom:24px; }
    .gn-form { width:100%; display:flex; flex-direction:column; gap:16px; }
    .gn-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .gn-error { padding:12px 16px; background:rgba(221,0,49,0.06); border:1px solid rgba(221,0,49,0.2); border-left:3px solid #DD0031; border-radius:8px; font-size:13px; color:#DD0031; font-family:'JetBrains Mono',monospace; }
    .gn-success { padding:12px 16px; background:rgba(40,200,64,0.06); border:1px solid rgba(40,200,64,0.2); border-left:3px solid #28c840; border-radius:8px; font-size:13px; color:#28c840; font-family:'JetBrains Mono',monospace; }
    .gn-btn { display:flex; align-items:center; justify-content:center; gap:10px; padding:16px; border:none; border-radius:10px; font-family:'Chakra Petch',sans-serif; font-size:14px; font-weight:600; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.25s; width:100%; }
    .gn-btn:active { transform:scale(0.98); }
    .gn-btn-lg { padding:18px; font-size:15px; margin-top:4px; }
    .gn-btn-primary { background:linear-gradient(135deg,#DD0031,#c02070,#1793D1); background-size:200% 200%; animation:gnGrad 4s ease infinite; color:#fff; }
    @keyframes gnGrad { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
    .gn-btn-primary:hover { box-shadow:0 8px 30px rgba(221,0,49,0.3), 0 0 40px rgba(23,147,209,0.1); transform:translateY(-2px); }

    /* ═══ PASSWORD STRENGTH CHECKER ═══ */
    .gn-pwd-checker {
      display:flex; flex-direction:column; gap:10px;
      padding:12px 14px;
      background:rgba(10,10,20,0.5);
      border:1px solid rgba(255,255,255,0.05);
      border-radius:10px;
      animation:pwdIn 0.25s ease;
    }
    @keyframes pwdIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
    .gn-pwd-bar-track {
      width:100%; height:6px;
      background:rgba(255,255,255,0.06);
      border-radius:3px; overflow:hidden;
    }
    .gn-pwd-bar-fill {
      height:100%;
      border-radius:3px;
      background:linear-gradient(90deg, #DD0031, #f0b232);
      transition:width 0.3s ease, background 0.3s ease;
    }
    .gn-pwd-bar-fill.strength-ok {
      background:linear-gradient(90deg, #28c840, #40e060);
      box-shadow:0 0 10px rgba(40,200,64,0.4);
    }
    .gn-pwd-reqs {
      display:grid; grid-template-columns:1fr 1fr;
      gap:4px 12px;
    }
    .gn-pwd-req {
      display:flex; align-items:center; gap:6px;
      font-family:'JetBrains Mono',monospace;
      font-size:11px;
      transition:color 0.2s;
    }
    .gn-pwd-req.req-ok { color:#28c840; }
    .gn-pwd-req.req-bad { color:#555; }
    .req-icon { font-size:11px; flex-shrink:0; }
    .req-ok .req-icon { text-shadow:0 0 6px rgba(40,200,64,0.5); }

    @media (max-width:700px) {
      .gn-split { flex-direction:column; }
      .gn-left { flex:0 0 auto; padding:24px 20px; border-right:none; border-bottom:1px solid rgba(255,255,255,0.05); }
      .gn-logo-wrap { width:80px; height:80px; margin-bottom:14px; }
      .gn-left-title { font-size:28px; letter-spacing:4px; }
      .gn-right { padding:20px 24px; }
      .gn-right-inner { max-width:100%; }
      .gn-h2 { font-size:22px; }
      .gn-grid-2 { grid-template-columns:1fr; gap:12px; }
      .gn-btn { padding:14px; font-size:13px; }
      .gn-btn-lg { padding:16px; font-size:14px; }
      .gn-pwd-reqs { grid-template-columns:1fr; }
    }
  `]
})
export class RegisterViewComponent {
  @Input() error = '';
  @Input() success = '';
  @Output() switchView = new EventEmitter<'login'>();
  @Output() errorChange = new EventEmitter<string>();
  @Output() successChange = new EventEmitter<string>();
  @Output() clearErrors = new EventEmitter<void>();
  @Output() register = new EventEmitter<{
    username: string;
    email: string;
    displayName: string;
    password: string;
    avatarBase64?: string;
  }>();

  showPwd = signal(false);
  regUser = '';
  regEmail = '';
  regDisplay = '';
  regPass = signal('');           // ⬅️ CAMBIO: signal (antes propiedad plana — el computed no la rastreaba)
  regPassConfirm = signal('');    // ⬅️ CAMBIO: signal
  regAvatarPreview = signal<string>('');

  userIcon = '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>';
  emailIcon = '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>';
  editIcon = '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>';
  lockIcon = '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>';

  onRegAvatarPreview(url: string): void { this.regAvatarPreview.set(url); }
  onAvatarError(msg: string): void { this.errorChange.emit(msg); }

  // ══════════════════════════════════════════════════════════
  //  PASSWORD STRENGTH CHECKER — ahora completamente reactivo
  // ══════════════════════════════════════════════════════════

  // Lee la SIGNAL regPass() → Angular rastrea cada cambio y recalcula al instante
  pwdReqs = computed(() => {
    const pass = this.regPass();
    return {
      length:   pass.length >= 6,
      upper:    /[A-Z]/.test(pass),
      number:   /\d/.test(pass),
      specials: (pass.match(/[^A-Za-z0-9]/g) || []).length >= 2
    };
  });

  // Porcentaje 0-100 para la barra (25% por requisito cumplido)
  pwdStrength = computed(() => {
    const r = this.pwdReqs();
    const met = [r.length, r.upper, r.number, r.specials].filter(Boolean).length;
    return met * 25;
  });

  // ¿La contraseña cumple TODOS los requisitos?
  pwdValid = computed(() => {
    const r = this.pwdReqs();
    return r.length && r.upper && r.number && r.specials;
  });

  onRegister(): void {
    this.clearErrors.emit();
    const pass = this.regPass();           // ⬅️ CAMBIO: leer valor actual de la signal
    const confirm = this.regPassConfirm(); // ⬅️ CAMBIO

    if (!this.regUser.trim()) { this.errorChange.emit('Ingresa un nombre de usuario'); return; }
    if (!this.regEmail.trim()) { this.errorChange.emit('Ingresa un email'); return; }
    if (!pass) { this.errorChange.emit('Ingresa una contrasena'); return; }

    // Validación específica por requisito
    const r = this.pwdReqs();
    if (!r.length)    { this.errorChange.emit('La contrasena debe tener al menos 6 caracteres'); return; }
    if (!r.upper)     { this.errorChange.emit('La contrasena debe incluir al menos una mayuscula'); return; }
    if (!r.number)    { this.errorChange.emit('La contrasena debe incluir al menos un numero'); return; }
    if (!r.specials)  { this.errorChange.emit('La contrasena debe incluir al menos dos caracteres especiales'); return; }

    if (pass !== confirm) { this.errorChange.emit('Las contrasenas no coinciden'); return; }
    this.register.emit({
      username: this.regUser.trim(),
      email: this.regEmail.trim(),
      displayName: this.regDisplay.trim() || this.regUser.trim(),
      password: pass,
      avatarBase64: this.regAvatarPreview() || undefined
    });
  }
}