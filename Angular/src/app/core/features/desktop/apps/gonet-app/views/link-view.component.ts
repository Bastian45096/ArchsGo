import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormFieldComponent } from '../shared/form-field.component';
import { AvatarUploaderComponent } from '../shared/avatar-uploader.component';
import { ParticleCanvasComponent } from '../shared/particle-canvas.component';

@Component({
  selector: 'app-link-view',
  standalone: true,
  imports: [CommonModule, FormsModule, FormFieldComponent, AvatarUploaderComponent, ParticleCanvasComponent],
  template: `
    <div class="gn-page">
      <div class="gn-split">
        <div class="gn-left">
          <app-particle-canvas mode="particles"></app-particle-canvas>
          <div class="gn-link-orb orb-red"></div>
          <div class="gn-link-orb orb-blue"></div>
          <div class="gn-link-orb orb-purple"></div>
          <div class="gn-link-energy">
            <div class="energy-line e1"></div><div class="energy-line e2"></div>
            <div class="energy-line e3"></div><div class="energy-line e4"></div>
            <div class="energy-line e5"></div>
          </div>
          <button class="gn-back-corner" (click)="clearErrors.emit(); switchView.emit('login')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Volver al login
          </button>
          <div class="gn-left-center">
            <div class="gn-link-logos gn-link-logos-float">
              <div class="gn-link-logo gn-link-logo-left">
                <div class="gn-logo-ring ring-red"></div>
                <svg viewBox="0 0 80 80" fill="none" width="56" height="56">
                  <path d="M40 6 L68 20 L68 52 Q68 72 40 78 Q12 72 12 52 L12 20 Z" fill="none" stroke="#DD0031" stroke-width="2.5" opacity="0.8"/>
                  <path d="M40 20 L28 58 L34 58 L40 30 L46 58 L52 58 Z" fill="#DD0031" opacity="0.7"/>
                </svg>
                <span>ArchsGo</span>
              </div>
              <div class="gn-link-bridge gn-link-bridge-anim">
                <svg viewBox="0 0 120 60" fill="none" width="120" height="60">
                  <path d="M10 30 Q60 10 110 30" stroke="#DD0031" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.4"><animate attributeName="d" values="M10 30 Q60 10 110 30;M10 30 Q60 50 110 30;M10 30 Q60 10 110 30" dur="3s" repeatCount="indefinite"/></path>
                  <path d="M10 30 Q60 50 110 30" stroke="#1793D1" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.4"><animate attributeName="d" values="M10 30 Q60 50 110 30;M10 30 Q60 10 110 30;M10 30 Q60 50 110 30" dur="3s" repeatCount="indefinite"/></path>
                  <path d="M10 30 Q60 30 110 30" stroke="#c02070" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"><animate attributeName="stroke-dasharray" values="0 200;100 100;200 0;100 100;0 200" dur="4s" repeatCount="indefinite"/></path>
                  <circle r="4" fill="#c02070" opacity="0.8"><animate attributeName="cx" values="10;60;110;60;10" dur="3s" repeatCount="indefinite"/><animate attributeName="cy" values="30;15;30;45;30" dur="3s" repeatCount="indefinite"/></circle>
                </svg>
              </div>
              <div class="gn-link-logo gn-link-logo-right">
                <div class="gn-logo-ring ring-blue"></div>
                <svg viewBox="0 0 80 80" fill="none" width="56" height="56">
                  <circle cx="40" cy="40" r="37" fill="none" stroke="#1793D1" stroke-width="2.5" stroke-dasharray="46 28" stroke-linecap="round" opacity="0.8"/>
                  <path d="M40 12 L64 64 L16 64 Z" fill="none" stroke="#1793D1" stroke-width="2" opacity="0.7"/>
                  <path d="M32 30 L40 12 L48 30" stroke="#1793D1" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8"/>
                </svg>
                <span>GoNET</span>
              </div>
            </div>
            <p class="gn-left-desc gn-link-desc">Vincula tu cuenta de ArchsGo con GoNET para usar una sola sesion en ambos sistemas.</p>
          </div>
        </div>
        <div class="gn-right">
          <div class="gn-right-inner">
            <h2 class="gn-h2">Vincular cuenta de ArchsGo</h2>
            <p class="gn-sub">Usa tu cuenta existente para acceder a GoNET</p>
            <div class="gn-form">
              <app-avatar-uploader [preview]="linkAvatarPreview" (previewChange)="onLinkAvatarPreview($event)" (errorChange)="onAvatarError($event)"/>
              <div class="gn-grid-2">
                <app-form-field label="Usuario o email de ArchsGo" placeholder="Tu usuario de ArchsGo" [model]="linkUser" (modelChange)="linkUser = $event" [spellcheck]="false"
                  [iconPath]="userIcon"/>
                <app-form-field label="Contrasena de ArchsGo" placeholder="Tu contrasena" [type]="showPwd() ? 'text' : 'password'" [model]="linkPass" (modelChange)="linkPass = $event"
                  [iconPath]="lockIcon"/>
              </div>
              <app-form-field label="Nombre para mostrar en GoNET" placeholder="Como te van a ver en GoNET" [model]="linkDisplay" (modelChange)="linkDisplay = $event"
                [iconPath]="editIcon"/>
              <div class="gn-error" *ngIf="error">{{ error }}</div>
              <div class="gn-success" *ngIf="success">{{ success }}</div>
              <button class="gn-btn gn-btn-archsgo gn-btn-lg" (click)="onLink()">Vincular cuenta</button>
            </div>
            <div class="gn-info-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span>Tu cuenta de ArchsGo se vinculara con GoNET. Mantendras tus datos de ambos sistemas.</span>
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
    .gn-left { flex:0 0 40%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 32px; position:relative; overflow:hidden; border-right:1px solid rgba(255,255,255,0.05); background:#040408; }
    .gn-left::before { content:''; position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 400px 400px at 25% 35%, rgba(221,0,49,0.08), transparent), radial-gradient(ellipse 350px 350px at 75% 65%, rgba(23,147,209,0.07), transparent), radial-gradient(ellipse 200px 200px at 50% 50%, rgba(192,32,112,0.05), transparent); }
    .gn-left-center { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; width:100%; position:relative; z-index:10; }
    .gn-right { flex:1; display:flex; align-items:center; justify-content:center; padding:32px 48px; overflow-y:auto; }
    .gn-right-inner { width:100%; max-width:480px; display:flex; flex-direction:column; animation:gnSlide 0.5s cubic-bezier(0.16,1,0.3,1); }
    @keyframes gnSlide { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
    .gn-back-corner { position:absolute; top:12px; left:16px; display:flex; align-items:center; gap:6px; background:rgba(0,0,0,0.3); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.06); border-radius:8px; color:#777; font-family:'Chakra Petch',sans-serif; font-size:12px; font-weight:500; padding:8px 14px; cursor:pointer; transition:all 0.25s; z-index:20; }
    .gn-back-corner:hover { color:#DD0031; border-color:rgba(221,0,49,0.3); background:rgba(221,0,49,0.08); }
    .gn-link-orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; z-index:2; }
    .orb-red { width:300px; height:300px; background:radial-gradient(circle, rgba(221,0,49,0.15), transparent 70%); top:-80px; left:-100px; animation:orbFloat1 12s ease-in-out infinite; }
    .orb-blue { width:280px; height:280px; background:radial-gradient(circle, rgba(23,147,209,0.12), transparent 70%); bottom:-60px; right:-80px; animation:orbFloat2 14s ease-in-out infinite; }
    .orb-purple { width:200px; height:200px; background:radial-gradient(circle, rgba(192,32,112,0.1), transparent 70%); top:40%; left:30%; animation:orbFloat3 10s ease-in-out infinite; }
    @keyframes orbFloat1 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(40px,30px) scale(1.1); } 66% { transform:translate(-20px,50px) scale(0.9); } }
    @keyframes orbFloat2 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-30px,-40px) scale(1.15); } 66% { transform:translate(20px,-20px) scale(0.85); } }
    @keyframes orbFloat3 { 0%,100% { transform:translate(0,0) scale(1); opacity:0.6; } 50% { transform:translate(30px,-30px) scale(1.2); opacity:1; } }
    .gn-link-energy { position:absolute; inset:0; z-index:2; pointer-events:none; overflow:hidden; }
    .energy-line { position:absolute; height:1px; opacity:0; }
    .e1 { width:100%; top:20%; left:-100%; background:linear-gradient(90deg, transparent, #DD0031, transparent); animation:energySlide 6s ease-in-out infinite; }
    .e2 { width:80%; top:40%; left:-80%; background:linear-gradient(90deg, transparent, #c02070, transparent); animation:energySlide 8s ease-in-out infinite 1s; }
    .e3 { width:100%; top:60%; left:-100%; background:linear-gradient(90deg, transparent, #1793D1, transparent); animation:energySlide 7s ease-in-out infinite 2s; }
    .e4 { width:60%; top:80%; left:-60%; background:linear-gradient(90deg, transparent, #8040a0, transparent); animation:energySlide 9s ease-in-out infinite 3s; }
    .e5 { width:90%; top:35%; left:-90%; background:linear-gradient(90deg, transparent, #38b6f0, transparent); animation:energySlide 5s ease-in-out infinite 0.5s; }
    @keyframes energySlide { 0% { left:-100%; opacity:0; } 10% { opacity:0.4; } 90% { opacity:0.4; } 100% { left:100%; opacity:0; } }
    .gn-link-logos { display:flex; align-items:center; gap:24px; margin-bottom:28px; }
    .gn-link-logos-float { animation:logosHover 4s ease-in-out infinite; }
    @keyframes logosHover { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
    .gn-link-logo { display:flex; flex-direction:column; align-items:center; gap:10px; position:relative; }
    .gn-link-logo span { font-size:13px; font-weight:600; letter-spacing:1.5px; color:#aaa; text-shadow:0 0 20px rgba(255,255,255,0.1); }
    .gn-logo-ring { position:absolute; width:80px; height:80px; border-radius:50%; top:50%; left:50%; transform:translate(-50%, -55%); pointer-events:none; }
    .ring-red { border:1px solid rgba(221,0,49,0.15); animation:ringPulse 3s ease-in-out infinite; box-shadow:0 0 30px rgba(221,0,49,0.1); }
    .ring-blue { border:1px solid rgba(23,147,209,0.15); animation:ringPulse 3s ease-in-out infinite 1.5s; box-shadow:0 0 30px rgba(23,147,209,0.1); }
    @keyframes ringPulse { 0%,100% { transform:translate(-50%,-55%) scale(1); opacity:0.4; } 50% { transform:translate(-50%,-55%) scale(1.3); opacity:0; } }
    .gn-link-bridge-anim { display:flex; align-items:center; justify-content:center; }
    .gn-link-desc { max-width:280px; font-size:13px; color:#444; text-align:center; line-height:1.7; text-shadow:0 0 20px rgba(0,0,0,0.8); z-index:1; }
    .gn-h2 { font-size:26px; font-weight:600; letter-spacing:1px; margin-bottom:6px; color:#e8e8f0; }
    .gn-sub { font-size:14px; color:#666; margin-bottom:24px; }
    .gn-form { width:100%; display:flex; flex-direction:column; gap:16px; }
    .gn-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .gn-error { padding:12px 16px; background:rgba(221,0,49,0.06); border:1px solid rgba(221,0,49,0.2); border-left:3px solid #DD0031; border-radius:8px; font-size:13px; color:#DD0031; font-family:'JetBrains Mono',monospace; }
    .gn-success { padding:12px 16px; background:rgba(40,200,64,0.06); border:1px solid rgba(40,200,64,0.2); border-left:3px solid #28c840; border-radius:8px; font-size:13px; color:#28c840; font-family:'JetBrains Mono',monospace; }
    .gn-info-box { display:flex; align-items:flex-start; gap:12px; margin-top:20px; padding:14px 18px; background:rgba(23,147,209,0.04); border:1px solid rgba(23,147,209,0.1); border-radius:10px; color:#666; font-size:13px; line-height:1.6; width:100%; }
    .gn-info-box svg { flex-shrink:0; margin-top:2px; color:#1793D1; }
    .gn-btn { display:flex; align-items:center; justify-content:center; gap:10px; padding:16px; border:none; border-radius:10px; font-family:'Chakra Petch',sans-serif; font-size:14px; font-weight:600; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.25s; width:100%; }
    .gn-btn:active { transform:scale(0.98); }
    .gn-btn-lg { padding:18px; font-size:15px; margin-top:4px; }
    .gn-btn-archsgo { background:linear-gradient(135deg,#DD0031,#c02070,#1793D1); background-size:200% 200%; animation:gnGrad 4s ease infinite; color:#fff; }
    @keyframes gnGrad { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
    .gn-btn-archsgo:hover { box-shadow:0 8px 30px rgba(221,0,49,0.2); transform:translateY(-2px); }
    @media (max-width:700px) { .gn-split { flex-direction:column; } .gn-left { flex:0 0 auto; padding:24px 20px; border-right:none; border-bottom:1px solid rgba(255,255,255,0.05); } .gn-right { padding:20px 24px; } .gn-right-inner { max-width:100%; } .gn-h2 { font-size:22px; } .gn-grid-2 { grid-template-columns:1fr; gap:12px; } .gn-link-logos { gap:12px; } .gn-link-logo svg { width:40px; height:40px; } .gn-logo-ring { width:60px; height:60px; } .gn-btn { padding:14px; font-size:13px; } .gn-btn-lg { padding:16px; font-size:14px; } .orb-red, .orb-blue { width:150px; height:150px; } .orb-purple { width:100px; height:100px; } }
  `]
})
export class LinkViewComponent {
  @Input() error = '';
  @Input() success = '';
  @Output() switchView = new EventEmitter<'login'>();
  @Output() errorChange = new EventEmitter<string>();
  @Output() successChange = new EventEmitter<string>();
  @Output() clearErrors = new EventEmitter<void>();
  // ✅ NUEVO: emite las credenciales de ArchsGo al padre
  @Output() link = new EventEmitter<{
    archsGoUsernameOrEmail: string;
    archsGoPassword: string;
    displayName: string;
    avatarBase64: string | null;
  }>();

  showPwd = signal(false);
  linkUser = '';
  linkPass = '';
  linkDisplay = '';
  linkAvatarPreview = signal<string>('');

  userIcon = '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>';
  lockIcon = '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>';
  editIcon = '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>';

  onLinkAvatarPreview(url: string): void { this.linkAvatarPreview.set(url); }
  onAvatarError(msg: string): void { this.errorChange.emit(msg); }

  onLink(): void {
    this.clearErrors.emit();
    if (!this.linkUser.trim()) { this.errorChange.emit('Ingresa tu usuario de ArchsGo'); return; }
    if (!this.linkPass) { this.errorChange.emit('Ingresa tu contrasena de ArchsGo'); return; }

    this.link.emit({
      archsGoUsernameOrEmail: this.linkUser.trim(),
      archsGoPassword: this.linkPass,
      displayName: this.linkDisplay.trim(),
      avatarBase64: this.linkAvatarPreview() || null
    });
  }
}