import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterStateService } from '../services/register-state.service';
import { PasswordRulesComponent } from './password-rules.component';
import { SocialButtonsComponent } from './social-buttons.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, PasswordRulesComponent, SocialButtonsComponent],
  template: `
    <div class="panel-right">
      <div class="corner tl"></div>
      <div class="corner br"></div>

      <div class="form-head">
        <div class="mini-icon">
          <svg viewBox="0 0 240 240" fill="none"><defs><linearGradient id="gF2" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#DD0031"/><stop offset="50%" stop-color="#7040b0"/><stop offset="100%" stop-color="#1793D1"/></linearGradient><linearGradient id="gD2" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#1a0010"/><stop offset="100%" stop-color="#001520"/></linearGradient><linearGradient id="gR2" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#DD0031"/><stop offset="100%" stop-color="#ff1a4a"/></linearGradient><linearGradient id="gB2" x1="240" y1="0" x2="0" y2="240" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#1793D1"/><stop offset="100%" stop-color="#38b6f0"/></linearGradient></defs><path d="M120 16 L210 56 L210 140 Q210 200 120 228 Q30 200 30 140 L30 56 Z" fill="none" stroke="url(#gF2)" stroke-width="4"/><path d="M120 16 L210 56 L210 140 Q210 200 120 228 Q30 200 30 140 L30 56 Z" fill="url(#gD2)" opacity="0.7"/><path d="M120 42 L78 170 L92 170 L120 68 L120 42 Z" fill="url(#gR2)" opacity="0.9"/><path d="M120 42 L162 170 L148 170 L120 68 L120 42 Z" fill="url(#gB2)" opacity="0.9"/><path d="M120 80 L100 155 L110 155 L120 100 L130 155 L140 155 Z" fill="url(#gD2)" opacity="0.95"/><rect x="96" y="130" width="48" height="4" rx="2" fill="url(#gF2)" opacity="0.7"/></svg>
          <span>ArchsGo</span>
        </div>
        <h2>Crear Cuenta</h2>
        <p>Reg&iacute;strate para empezar a construir</p>
        <div class="accent-bar"></div>
      </div>

      <div class="term-bar">
        <div class="term-dot d1"></div>
        <div class="term-dot d2"></div>
        <div class="term-dot d3"></div>
        <span class="term-txt"><b>$</b> archsgo --register <em>--new-user</em></span>
      </div>

      <form (ngSubmit)="state.onRegister()">

        <!-- Username -->
        <div class="fg fg-user">
          <div class="fg-head"><span class="pip"></span><span>Username</span></div>
          <div class="inp-wrap">
            <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input type="text" [(ngModel)]="state.username" name="username" placeholder="tu_username" autocomplete="username" spellcheck="false">
          </div>
          <div class="inp-line"></div>
          @if (state.errUsername()) { <div class="field-err">{{ state.errUsername() }}</div> }
        </div>

        <!-- Email -->
        <div class="fg fg-email">
          <div class="fg-head"><span class="pip"></span><span>Email</span></div>
          <div class="inp-wrap">
            <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
            <input type="email" [(ngModel)]="state.email" name="email" placeholder="tu&#64;correo.com" autocomplete="email" spellcheck="false">
          </div>
          <div class="inp-line"></div>
          @if (state.errEmail()) { <div class="field-err">{{ state.errEmail() }}</div> }
        </div>

        <!-- Password -->
        <div class="fg fg-pass">
          <div class="fg-head"><span class="pip"></span><span>Contrase&ntilde;a</span></div>
          <div class="inp-wrap">
            <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input [type]="state.showPwd() ? 'text' : 'password'" [(ngModel)]="state.password" name="password" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;" autocomplete="new-password">
            <button type="button" class="eye-btn" (click)="state.showPwd.set(!state.showPwd())" tabindex="-1">
              @if (!state.showPwd()) {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              } @else {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              }
            </button>
          </div>
          <div class="inp-line"></div>
          <app-password-rules></app-password-rules>
          @if (state.errPassword()) { <div class="field-err">{{ state.errPassword() }}</div> }
        </div>

        <!-- Confirm -->
        <div class="fg fg-confirm">
          <div class="fg-head"><span class="pip"></span><span>Confirmar contrase&ntilde;a</span></div>
          <div class="inp-wrap">
            <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <input [type]="state.showConfirm() ? 'text' : 'password'" [(ngModel)]="state.confirmPassword" name="confirmPassword" placeholder="Repite tu contrase&ntilde;a" autocomplete="new-password">
            <button type="button" class="eye-btn" (click)="state.showConfirm.set(!state.showConfirm())" tabindex="-1">
              @if (!state.showConfirm()) {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              } @else {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              }
            </button>
          </div>
          <div class="inp-line"></div>
          @if (state.confirmPassword.length > 0 && !state.passwordsMatch()) {
            <div class="mismatch"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Las contrase&ntilde;as no coinciden</div>
          }
          @if (state.confirmPassword.length > 0 && state.passwordsMatch()) {
            <div class="match"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Las contrase&ntilde;as coinciden</div>
          }
          @if (state.errConfirm()) { <div class="field-err">{{ state.errConfirm() }}</div> }
        </div>

        <!-- Terms -->
        <div class="opts">
          <label class="chk">
            <div class="chk-box">
              <input type="checkbox" [(ngModel)]="state.acceptTerms" name="acceptTerms">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span>Acepto los <a href="#" class="terms-link">t&eacute;rminos y condiciones</a></span>
          </label>
        </div>

        <button type="submit" class="submit" [disabled]="state.loading() || !state.canSubmit()">
          <span class="submit-inner">
            @if (!state.loading()) {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              Crear Cuenta
            }
            @if (state.loading()) { <span class="spin"></span> }
          </span>
        </button>
        @if (state.errGeneral()) { <div class="field-err field-err-general">{{ state.errGeneral() }}</div> }
      </form>

      <div class="divider"><div class="divider-line"></div><span class="divider-txt">o reg&iacute;strate con</span><div class="divider-line"></div></div>

      <app-social-buttons></app-social-buttons>

      <div class="form-foot"><p>&iquest;Ya tienes cuenta? <a routerLink="/login">Iniciar sesi&oacute;n</a></p></div>
      <span class="ver">v2.0.0-stable</span>
    </div>
  `,
  styles: [`
    :host { display:block; }
    .panel-right { width:500px; height:100vh; background:#0d0d18; border-left:1px solid rgba(255,255,255,0.08); box-shadow:-8px 0 40px rgba(0,0,0,0.5),-2px 0 0 rgba(221,0,49,0.08),2px 0 0 rgba(23,147,209,0.08); display:flex; flex-direction:column; justify-content:center; padding:48px 44px; position:relative; overflow-y:auto; }
    .panel-right::before { content:''; position:absolute; top:0; left:0; width:2px; height:100%; background:linear-gradient(to bottom,#DD0031,transparent 30%,transparent 70%,#1793D1); opacity:0.7; }
    .panel-right::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,#DD0031,rgba(160,64,176,0.3),#1793D1); opacity:0.4; }
    .corner { position:absolute; width:36px; height:36px; pointer-events:none; }
    .corner.tl { top:18px; left:18px; border-top:1.5px solid #DD0031; border-left:1.5px solid #DD0031; opacity:0.3; }
    .corner.br { bottom:18px; right:18px; border-bottom:1.5px solid #1793D1; border-right:1.5px solid #1793D1; opacity:0.3; }
    .form-head { margin-bottom:28px; opacity:0; animation:slideR 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s forwards; }
    @keyframes slideR { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
    .form-head .mini-icon { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
    .form-head .mini-icon svg { width:28px; height:28px; filter:drop-shadow(0 0 8px rgba(221,0,49,0.2)) drop-shadow(0 0 8px rgba(23,147,209,0.15)); }
    .form-head .mini-icon span { font-family:'Chakra Petch',sans-serif; font-size:14px; font-weight:600; letter-spacing:3px; text-transform:uppercase; color:#555568; }
    .form-head h2 { font-family:'Chakra Petch',sans-serif; font-size:26px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; color:#e8e8f0; }
    .form-head p { font-family:'Chakra Petch',sans-serif; font-size:13px; color:#555568; letter-spacing:0.3px; }
    .form-head .accent-bar { width:44px; height:2px; background:linear-gradient(90deg,#DD0031,#1793D1); margin-top:14px; border-radius:1px; }
    .term-bar { display:flex; align-items:center; gap:7px; padding:10px 14px; margin-bottom:22px; background:rgba(0,0,0,0.4); border-radius:8px; border:1px solid rgba(255,255,255,0.05); opacity:0; animation:slideR 0.5s ease 0.2s forwards; }
    .term-dot { width:8px; height:8px; border-radius:50%; }
    .term-dot.d1 { background:#ff5f57; }
    .term-dot.d2 { background:#febc2e; }
    .term-dot.d3 { background:#28c840; }
    .term-txt { font-family:'JetBrains Mono',monospace; font-size:11px; color:#2a2a38; margin-left:6px; }
    .term-txt b { color:#DD0031; font-weight:400; }
    .term-txt em { color:#1793D1; font-style:normal; }
    .fg { margin-bottom:18px; opacity:0; animation:slideR 0.5s ease forwards; }
    .fg-user { animation-delay:0.3s; }
    .fg-email { animation-delay:0.4s; }
    .fg-pass { animation-delay:0.5s; }
    .fg-confirm { animation-delay:0.6s; }
    .fg-head { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
    .fg-head .pip { width:5px; height:5px; border-radius:1px; transform:rotate(45deg); }
    .fg-user .pip { background:#DD0031; }
    .fg-email .pip { background:#a040b0; }
    .fg-pass .pip { background:#1793D1; }
    .fg-confirm .pip { background:#28c840; }
    .fg-head span { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:#555568; }
    .fg-head::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.05); margin-left:8px; }
    .inp-wrap { position:relative; }
    .inp-wrap .ico { position:absolute; left:14px; top:50%; transform:translateY(-50%); width:16px; height:16px; color:#2a2a38; transition:color 0.35s; pointer-events:none; }
    .inp-wrap input { width:100%; padding:13px 16px 13px 44px; background:#10101c; border:1px solid rgba(255,255,255,0.06); border-radius:8px; color:#dcdce4; font-family:'JetBrains Mono',monospace; font-size:13px; outline:none; transition:all 0.35s ease; letter-spacing:0.5px; }
    .inp-wrap input::placeholder { color:#2a2a38; font-size:12px; letter-spacing:1px; }
    .inp-wrap input:focus { background:#141422; border-color:#DD0031; box-shadow:0 0 0 3px rgba(221,0,49,0.08),0 0 25px rgba(221,0,49,0.04); }
    .fg-email .inp-wrap input:focus { border-color:#a040b0; box-shadow:0 0 0 3px rgba(160,64,176,0.08),0 0 25px rgba(160,64,176,0.04); }
    .fg-pass .inp-wrap input:focus { border-color:#1793D1; box-shadow:0 0 0 3px rgba(23,147,209,0.08),0 0 25px rgba(23,147,209,0.04); }
    .fg-confirm .inp-wrap input:focus { border-color:#28c840; box-shadow:0 0 0 3px rgba(40,200,64,0.08),0 0 25px rgba(40,200,64,0.04); }
    .inp-wrap:focus-within .ico { color:#DD0031; }
    .fg-email .inp-wrap:focus-within .ico { color:#a040b0; }
    .fg-pass .inp-wrap:focus-within .ico { color:#1793D1; }
    .fg-confirm .inp-wrap:focus-within .ico { color:#28c840; }
    .inp-line { height:2px; margin-top:3px; border-radius:1px; transform:scaleX(0); transform-origin:left; transition:transform 0.4s cubic-bezier(0.16,1,0.3,1); }
    .fg-user .inp-line { background:linear-gradient(90deg,#DD0031,transparent); }
    .fg-email .inp-line { background:linear-gradient(90deg,#a040b0,transparent); }
    .fg-pass .inp-line { background:linear-gradient(90deg,#1793D1,transparent); }
    .fg-confirm .inp-line { background:linear-gradient(90deg,#28c840,transparent); }
    .inp-wrap:focus-within ~ .inp-line { transform:scaleX(1); }
    .eye-btn { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:#2a2a38; cursor:pointer; padding:4px; display:flex; transition:color 0.3s; }
    .eye-btn:hover { color:#555568; }
    .mismatch,.match { display:flex; align-items:center; gap:6px; margin-top:8px; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.5px; animation:fadeMsg 0.3s ease; }
    .mismatch { color:#DD0031; }
    .match { color:#28c840; }
    @keyframes fadeMsg { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
    .opts { display:flex; align-items:center; margin-bottom:22px; opacity:0; animation:slideR 0.5s ease 0.7s forwards; }
    .chk { display:flex; align-items:center; gap:9px; cursor:pointer; user-select:none; font-family:'Chakra Petch',sans-serif; font-size:12px; color:#555568; }
    .chk-box { width:16px; height:16px; border:1.5px solid rgba(255,255,255,0.1); border-radius:4px; position:relative; background:#10101c; display:flex; align-items:center; justify-content:center; transition:all 0.3s; flex-shrink:0; }
    .chk-box input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; padding:0; border:none; }
    .chk-box svg { width:10px; height:10px; opacity:0; transform:scale(0); transition:all 0.2s; color:#060608; }
    .chk-box input:checked ~ svg { opacity:1; transform:scale(1); }
    .chk-box:has(input:checked) { background:linear-gradient(135deg,#DD0031,#1793D1); border-color:transparent; }
    .terms-link { color:#1793D1; text-decoration:none; transition:color 0.2s; }
    .terms-link:hover { color:#38b6f0; }
    .submit { width:100%; padding:15px; border:none; border-radius:8px; font-family:'Chakra Petch',sans-serif; font-size:13px; font-weight:700; letter-spacing:5px; text-transform:uppercase; color:#fff; cursor:pointer; position:relative; overflow:hidden; background:linear-gradient(135deg,#DD0031 0%,#a040b0 50%,#1793D1 100%); background-size:250% 250%; animation:gradM 6s ease infinite,slideR 0.5s ease 0.8s forwards; opacity:0; transition:transform 0.2s,box-shadow 0.3s,opacity 0.3s; }
    @keyframes gradM { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    .submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 30px rgba(221,0,49,0.25),0 8px 30px rgba(23,147,209,0.15); }
    .submit:active:not(:disabled) { transform:translateY(0) scale(0.98); }
    .submit:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
    .submit::after { content:''; position:absolute; top:-50%; left:-70%; width:50%; height:200%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); transform:skewX(-25deg); transition:left 0.7s ease; }
    .submit:hover:not(:disabled)::after { left:130%; }
    .submit-inner { position:relative; z-index:2; display:flex; align-items:center; justify-content:center; gap:10px; }
    .spin { display:inline-block; width:18px; height:18px; border:2px solid rgba(255,255,255,0.2); border-top-color:#fff; border-radius:50%; animation:rot 0.6s linear infinite; }
    @keyframes rot { to{transform:rotate(360deg)} }
    .divider { display:flex; align-items:center; gap:14px; margin:22px 0; opacity:0; animation:slideR 0.5s ease 0.9s forwards; }
    .divider-line { flex:1; height:1px; background:rgba(255,255,255,0.05); }
    .divider-txt { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:3px; text-transform:uppercase; color:#2a2a38; }
    .form-foot { text-align:center; margin-top:24px; opacity:0; animation:slideR 0.5s ease 1.1s forwards; }
    .form-foot p { font-family:'Chakra Petch',sans-serif; font-size:13px; color:#555568; }
    .form-foot a { color:#1793D1; text-decoration:none; font-weight:600; transition:color 0.3s; }
    .form-foot a:hover { color:#38b6f0; }
    .ver { position:absolute; bottom:16px; right:20px; font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:2px; color:#2a2a38; text-transform:uppercase; opacity:0; animation:slideR 0.5s ease 1.2s forwards; }
    .field-err { display:flex; align-items:center; gap:6px; margin-top:6px; padding:6px 10px; background:rgba(221,0,49,0.06); border-left:2px solid #DD0031; border-radius:0 6px 6px 0; font-family:'JetBrains Mono',monospace; font-size:10px; color:#DD0031; letter-spacing:0.3px; animation:fadeMsg 0.3s ease; }
    .field-err-general { margin-top:12px; justify-content:center; border-left:none; border:1px solid rgba(221,0,49,0.12); border-radius:8px; padding:10px 14px; font-size:11px; }
  `]
})
export class RegisterFormComponent {
  state = inject(RegisterStateService);
}