import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterStateService } from '../services/register-state.service';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (state.showModal()) {
      <div class="modal-overlay">
        <div class="modal-box">
          <div class="modal-icon">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="mG" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#28c840"/><stop offset="100%" stop-color="#1793D1"/>
                </linearGradient>
                <filter id="mGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <circle cx="40" cy="40" r="34" fill="#0a0a14" stroke="url(#mG)" stroke-width="2.5" filter="url(#mGlow)"/>
              <circle cx="40" cy="40" r="26" fill="none" stroke="url(#mG)" stroke-width="0.8" opacity="0.2"/>
              <path d="M24 40 L35 51 L56 30" stroke="#28c840" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#mGlow)"/>
              <circle cx="40" cy="40" r="34" fill="none" stroke="url(#mG)" stroke-width="1" opacity="0.1">
                <animate attributeName="r" values="34;37;34" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
          <h3 class="modal-title">Creando tu cuenta</h3>
          <p class="modal-sub">Esto tomar&aacute; unos segundos...</p>
          <div class="modal-term">
            <div class="mt-line" [class.done]="state.modalStep() >= 1"><span class="mt-pip"></span><span class="mt-txt">Validando datos...</span></div>
            <div class="mt-line" [class.done]="state.modalStep() >= 2"><span class="mt-pip"></span><span class="mt-txt">Encriptando contrase&ntilde;a...</span></div>
            <div class="mt-line" [class.done]="state.modalStep() >= 3"><span class="mt-pip"></span><span class="mt-txt">Guardando en base de datos...</span></div>
            <div class="mt-line" [class.done]="state.modalStep() >= 4"><span class="mt-pip"></span><span class="mt-txt">Cuenta creada exitosamente</span></div>
          </div>
          <div class="modal-bar-wrap"><div class="modal-bar" [style.width.%]="state.modalProgress()"></div></div>
          <span class="modal-pct">{{ state.modalProgress() }}%</span>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display:block; }
    .modal-overlay { position:fixed; inset:0; z-index:5000; background:rgba(0,0,0,0.75); backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; pointer-events:all; animation:modalFadeIn 0.3s ease; }
    @keyframes modalFadeIn { from{opacity:0} to{opacity:1} }
    .modal-box { background:#0d0d18; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:40px 48px; text-align:center; max-width:380px; width:90%; box-shadow:0 20px 60px rgba(0,0,0,0.6); animation:modalSlideUp 0.4s cubic-bezier(0.16,1,0.3,1); }
    @keyframes modalSlideUp { from{opacity:0;transform:translateY(30px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
    .modal-icon { width:80px; height:80px; margin:0 auto 20px; animation:modalIconPulse 2s ease-in-out infinite; }
    .modal-icon svg { width:100%; height:100%; }
    @keyframes modalIconPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
    .modal-title { font-family:'Chakra Petch',sans-serif; font-size:20px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#e8e8f0; margin-bottom:6px; }
    .modal-sub { font-family:'Chakra Petch',sans-serif; font-size:12px; color:#555568; margin-bottom:24px; letter-spacing:0.3px; }
    .modal-term { text-align:left; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.04); border-radius:8px; padding:12px 14px; margin-bottom:20px; }
    .mt-line { display:flex; align-items:center; gap:8px; padding:5px 0; opacity:0.3; transition:opacity 0.4s ease; }
    .mt-line.done { opacity:1; }
    .mt-pip { width:6px; height:6px; border-radius:50%; background:#2a2a38; transition:all 0.4s ease; flex-shrink:0; }
    .mt-line.done .mt-pip { background:#28c840; box-shadow:0 0 8px rgba(40,200,64,0.5); }
    .mt-txt { font-family:'JetBrains Mono',monospace; font-size:11px; color:#3a3a48; transition:color 0.4s ease; }
    .mt-line.done .mt-txt { color:#7a7a88; }
    .mt-line:last-child.done .mt-txt { color:#28c840; font-weight:500; }
    .modal-bar-wrap { width:100%; height:6px; background:rgba(255,255,255,0.04); border-radius:3px; overflow:hidden; margin-bottom:8px; }
    .modal-bar { height:100%; border-radius:3px; background:linear-gradient(90deg,#DD0031,#a040b0,#1793D1,#28c840); background-size:300% 100%; animation:barGrad 3s ease infinite; transition:width 0.3s ease; }
    @keyframes barGrad { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    .modal-pct { font-family:'JetBrains Mono',monospace; font-size:10px; color:#555568; letter-spacing:1px; }
  `]
})
export class RegisterModalComponent {
  state = inject(RegisterStateService);
}