import {
    Component, Input, Output, EventEmitter
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  
  @Component({
    selector: 'app-loading-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
      <div class="gn-modal-overlay">
        <div class="gn-modal-card">
          <div class="gn-modal-orb mo-orb-1"></div>
          <div class="gn-modal-orb mo-orb-2"></div>
          <div class="gn-modal-orb mo-orb-3"></div>
          <div class="gn-modal-body">
            <div class="gn-modal-logo-wrap">
              <svg class="gn-modal-logo" viewBox="0 0 60 60" fill="none" width="44" height="44">
                <defs>
                  <linearGradient id="moLG" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#DD0031"/><stop offset="100%" stop-color="#1793D1"/>
                  </linearGradient>
                </defs>
                <circle cx="30" cy="30" r="27" fill="none" stroke="#DD0031" stroke-width="2" stroke-dasharray="34 21" stroke-linecap="round" opacity="0.6">
                  <animateTransform attributeName="transform" type="rotate" values="0 30 30;360 30 30" dur="8s" repeatCount="indefinite"/>
                </circle>
                <circle cx="30" cy="30" r="27" fill="none" stroke="#1793D1" stroke-width="2" stroke-dasharray="34 21" stroke-dashoffset="-34" stroke-linecap="round" opacity="0.4">
                  <animateTransform attributeName="transform" type="rotate" values="0 30 30;-360 30 30" dur="12s" repeatCount="indefinite"/>
                </circle>
                <path d="M30 10 L48 48 L12 48 Z" fill="none" stroke="url(#moLG)" stroke-width="2" opacity="0.7"/>
                <path d="M24 24 L30 10 L36 24" stroke="#DD0031" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8"/>
              </svg>
              <div class="gn-modal-logo-glow"></div>
            </div>
            <h3 class="gn-modal-title">
              <span *ngIf="!loadingSuccess && !loadingError && mode === 'register'">Creando tu cuenta</span>
              <span *ngIf="!loadingSuccess && !loadingError && mode === 'login'">Iniciando sesion</span>
              <span *ngIf="!loadingSuccess && !loadingError && mode === 'link'">Vinculando cuentas</span>
              <span *ngIf="loadingSuccess && mode === 'register'" class="mo-title-ok">&#161;Cuenta creada!</span>
              <span *ngIf="loadingSuccess && mode === 'login'" class="mo-title-ok">&#161;Sesion iniciada!</span>
              <span *ngIf="loadingSuccess && mode === 'link'" class="mo-title-ok">&#161;Cuentas vinculadas!</span>
              <span *ngIf="loadingError && mode === 'register'" class="mo-title-err">Error en el registro</span>
              <span *ngIf="loadingError && mode === 'login'" class="mo-title-err">Error al iniciar sesion</span>
              <span *ngIf="loadingError && mode === 'link'" class="mo-title-err">Error al vincular</span>
            </h3>
            <div class="gn-modal-ring-wrap" [class.ring-ok]="loadingSuccess" [class.ring-err]="!!loadingError">
              <svg class="gn-modal-ring" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="moRG" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#DD0031"/><stop offset="50%" stop-color="#c02070"/><stop offset="100%" stop-color="#1793D1"/>
                  </linearGradient>
                  <linearGradient id="moRGE" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#DD0031"/><stop offset="100%" stop-color="#ff1a4a"/>
                  </linearGradient>
                  <linearGradient id="moRGO" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#28c840"/><stop offset="100%" stop-color="#40e060"/>
                  </linearGradient>
                  <filter id="moRGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="5"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="5" stroke-dasharray="4 16" opacity="0.5"/>
                <circle cx="60" cy="60" r="50" fill="none"
                  [attr.stroke]="loadingSuccess ? 'url(#moRGO)' : loadingError ? 'url(#moRGE)' : 'url(#moRG)'"
                  stroke-width="5" stroke-linecap="round"
                  [attr.stroke-dasharray]="314.16"
                  [attr.stroke-dashoffset]="314.16 * (1 - progress / 100)"
                  transform="rotate(-90 60 60)"
                  class="mo-ring-fill" filter="url(#moRGlow)"/>
                <text x="60" y="55" text-anchor="middle" dominant-baseline="central" class="mo-ring-pct">{{progress}}%</text>
                <text x="60" y="73" text-anchor="middle" dominant-baseline="central" class="mo-ring-sub">{{loadingSuccess ? 'completado' : loadingError ? 'fallido' : 'procesando'}}</text>
              </svg>
              <div class="mo-check" *ngIf="loadingSuccess">
                <svg viewBox="0 0 52 52" width="52" height="52">
                  <circle class="mo-ck-c" cx="26" cy="26" r="22" fill="none" stroke="#28c840" stroke-width="2.5"/>
                  <path class="mo-ck-m" d="M15 27l7 7 15-15" fill="none" stroke="#28c840" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="gn-pbar-track">
              <div class="gn-pbar-fill" [style.width.%]="progress" [class.pbar-err]="!!loadingError" [class.pbar-ok]="loadingSuccess">
                <div class="gn-pbar-shimmer"></div>
              </div>
            </div>
            <div class="gn-pbar-info">
              <span class="gn-pbar-time">{{elapsedTime.toFixed(1)}}s</span>
              <span class="gn-pbar-pct">{{progress}}%</span>
            </div>
            <div class="gn-modal-msgs">
              <div class="gn-msg" *ngFor="let msg of progressMsgs; let i = index; trackBy: trackByIndex"
                   [class.msg-ok]="loadingSuccess || i < progressMsgs.length - 1"
                   [class.msg-active]="i === progressMsgs.length - 1 && !loadingSuccess && !loadingError"
                   [class.msg-err]="i === progressMsgs.length - 1 && !!loadingError">
                <span class="gn-msg-dot"></span>
                <span>{{msg}}</span>
              </div>
              <div class="gn-msg-cursor" *ngIf="!loadingSuccess && !loadingError && progressMsgs.length > 0"></div>
            </div>
            <div class="gn-modal-err" *ngIf="loadingError">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span>{{loadingError}}</span>
            </div>
            <button class="gn-modal-close" *ngIf="loadingError" (click)="closeModal.emit()">Cerrar</button>
          </div>
        </div>
      </div>
    `,
    styles: [`
      .gn-modal-overlay { position:fixed; inset:0; background:rgba(4,4,10,0.88); backdrop-filter:blur(16px); display:flex; align-items:center; justify-content:center; z-index:9999; animation:moOverlayIn 0.3s ease; }
      @keyframes moOverlayIn { from { opacity:0; } to { opacity:1; } }
      .gn-modal-card { position:relative; width:420px; max-width:92vw; background:linear-gradient(145deg, rgba(10,10,20,0.98), rgba(14,14,26,0.96)); border-radius:20px; border:1px solid rgba(255,255,255,0.06); overflow:hidden; animation:moCardIn 0.55s cubic-bezier(0.16,1,0.3,1); box-shadow:0 0 100px rgba(221,0,49,0.06), 0 0 100px rgba(23,147,209,0.04), 0 30px 80px rgba(0,0,0,0.6); }
      .gn-modal-card::before { content:''; position:absolute; inset:-1px; border-radius:20px; padding:1px; background:linear-gradient(135deg, rgba(221,0,49,0.25), rgba(192,32,112,0.12), rgba(23,147,209,0.25)); -webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none; }
      @keyframes moCardIn { 0% { opacity:0; transform:scale(0.9) translateY(25px); } 50% { transform:scale(1.015) translateY(-3px); } 100% { opacity:1; transform:scale(1) translateY(0); } }
      .gn-modal-orb { position:absolute; border-radius:50%; filter:blur(70px); pointer-events:none; }
      .mo-orb-1 { width:220px; height:220px; background:radial-gradient(circle, rgba(221,0,49,0.1), transparent 70%); top:-70px; right:-50px; animation:moOrbA 8s ease-in-out infinite; }
      .mo-orb-2 { width:180px; height:180px; background:radial-gradient(circle, rgba(23,147,209,0.08), transparent 70%); bottom:-50px; left:-40px; animation:moOrbB 10s ease-in-out infinite; }
      .mo-orb-3 { width:140px; height:140px; background:radial-gradient(circle, rgba(192,32,112,0.06), transparent 70%); top:40%; left:50%; transform:translate(-50%,-50%); animation:moOrbC 6s ease-in-out infinite; }
      @keyframes moOrbA { 0%,100% { transform:translate(0,0); } 50% { transform:translate(-25px,35px); } }
      @keyframes moOrbB { 0%,100% { transform:translate(0,0); } 50% { transform:translate(25px,-25px); } }
      @keyframes moOrbC { 0%,100% { transform:translate(-50%,-50%) scale(1); opacity:0.5; } 50% { transform:translate(-50%,-50%) scale(1.3); opacity:0.8; } }
      .gn-modal-body { position:relative; z-index:1; padding:36px 36px 30px; display:flex; flex-direction:column; align-items:center; gap:14px; }
      .gn-modal-logo-wrap { position:relative; width:60px; height:60px; margin-bottom:4px; }
      .gn-modal-logo { position:relative; z-index:1; filter:drop-shadow(0 0 15px rgba(221,0,49,0.3)); animation:moLogoPulse 3s ease-in-out infinite; }
      .gn-modal-logo-glow { position:absolute; inset:-30px; border-radius:50%; background:radial-gradient(circle, rgba(221,0,49,0.1), transparent 60%); filter:blur(15px); }
      @keyframes moLogoPulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.06); } }
      .gn-modal-title { font-family:'Chakra Petch',sans-serif; font-size:18px; font-weight:600; letter-spacing:3px; text-transform:uppercase; color:#c0c0cc; margin:0; }
      .mo-title-ok { background:linear-gradient(135deg,#28c840,#50f070); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      .mo-title-err { background:linear-gradient(135deg,#DD0031,#ff2a5a); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      .gn-modal-ring-wrap { position:relative; width:130px; height:130px; margin:2px 0; }
      .gn-modal-ring { width:100%; height:100%; }
      .mo-ring-fill { transition:stroke-dashoffset 0.2s ease-out; }
      .mo-ring-pct { fill:#e0e0ec; font-family:'Chakra Petch',sans-serif; font-size:24px; font-weight:700; }
      .mo-ring-sub { fill:#444; font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:2.5px; text-transform:uppercase; }
      .ring-ok .mo-ring-pct { fill:#28c840; }
      .ring-ok .mo-ring-sub { fill:#2a7030; }
      .ring-err .mo-ring-pct { fill:#DD0031; }
      .ring-err .mo-ring-sub { fill:#801020; }
      .mo-check { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; animation:moCheckIn 0.4s cubic-bezier(0.16,1,0.3,1); }
      @keyframes moCheckIn { from { opacity:0; transform:scale(0.4) rotate(-10deg); } to { opacity:1; transform:scale(1) rotate(0deg); } }
      .mo-ck-c { stroke-dasharray:138.23; stroke-dashoffset:138.23; animation:moCkCircle 0.6s ease forwards 0.15s; }
      .mo-ck-m { stroke-dasharray:40; stroke-dashoffset:40; animation:moCkDraw 0.35s ease forwards 0.55s; }
      @keyframes moCkCircle { to { stroke-dashoffset:0; } }
      @keyframes moCkDraw { to { stroke-dashoffset:0; } }
      .gn-pbar-track { position:relative; width:100%; height:10px; background:rgba(12,12,22,0.8); border-radius:5px; overflow:hidden; border:1px solid rgba(255,255,255,0.04); }
      .gn-pbar-track::before { content:''; position:absolute; inset:0; background:repeating-linear-gradient(90deg, transparent 0, transparent 7px, rgba(0,0,0,0.5) 7px, rgba(0,0,0,0.5) 9px); border-radius:5px; z-index:3; pointer-events:none; }
      .gn-pbar-fill { position:relative; height:100%; border-radius:5px; background:linear-gradient(90deg, #DD0031, #b01060, #c02070, #9030a0, #1793D1); transition:width 0.15s ease-out; overflow:hidden; box-shadow:0 0 14px rgba(192,32,112,0.3); z-index:1; }
      .gn-pbar-fill.pbar-err { background:linear-gradient(90deg, #DD0031, #ff1a4a); box-shadow:0 0 14px rgba(221,0,49,0.5); }
      .gn-pbar-fill.pbar-ok { background:linear-gradient(90deg, #28c840, #40e060); box-shadow:0 0 14px rgba(40,200,64,0.4); }
      .gn-pbar-shimmer { position:absolute; inset:0; background:linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%); background-size:250% 100%; animation:pbarShimmer 1.8s ease-in-out infinite; }
      @keyframes pbarShimmer { 0% { background-position:250% 0; } 100% { background-position:-250% 0; } }
      .gn-pbar-info { width:100%; display:flex; justify-content:space-between; font-family:'JetBrains Mono',monospace; font-size:10px; color:#3a3a4a; letter-spacing:1px; }
      .gn-modal-msgs { width:100%; display:flex; flex-direction:column; gap:5px; margin-top:2px; min-height:20px; }
      .gn-msg { display:flex; align-items:center; gap:10px; font-family:'JetBrains Mono',monospace; font-size:11.5px; color:#555; animation:msgIn 0.35s ease forwards; }
      @keyframes msgIn { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
      .gn-msg-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; transition:all 0.3s; }
      .msg-ok .gn-msg-dot { background:#28c840; box-shadow:0 0 6px rgba(40,200,64,0.4); }
      .msg-ok { color:#4a7a52; }
      .msg-active .gn-msg-dot { background:#DD0031; box-shadow:0 0 8px rgba(221,0,49,0.5); animation:dotActive 1s ease-in-out infinite; }
      .msg-active { color:#9a6070; }
      .msg-err .gn-msg-dot { background:#DD0031; box-shadow:0 0 6px rgba(221,0,49,0.4); }
      .msg-err { color:#DD0031; }
      @keyframes dotActive { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(1.4); } }
      .gn-msg-cursor { width:2px; height:12px; background:#DD0031; margin-left:22px; border-radius:1px; animation:cursorBlink 0.7s step-end infinite; }
      @keyframes cursorBlink { 0%,50% { opacity:1; } 51%,100% { opacity:0; } }
      .gn-modal-err { width:100%; display:flex; align-items:flex-start; gap:10px; padding:12px 16px; background:rgba(221,0,49,0.06); border:1px solid rgba(221,0,49,0.2); border-left:3px solid #DD0031; border-radius:8px; font-family:'JetBrains Mono',monospace; font-size:12px; color:#DD0031; }
      .gn-modal-err svg { flex-shrink:0; margin-top:1px; }
      .gn-modal-close { margin-top:2px; padding:12px 36px; background:rgba(221,0,49,0.07); border:1px solid rgba(221,0,49,0.2); border-radius:8px; color:#DD0031; font-family:'Chakra Petch',sans-serif; font-size:13px; font-weight:600; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.25s; }
      .gn-modal-close:hover { background:rgba(221,0,49,0.15); border-color:rgba(221,0,49,0.4); box-shadow:0 4px 20px rgba(221,0,49,0.1); }
      @media (max-width:700px) { .gn-modal-body { padding:28px 22px 24px; } .gn-modal-ring-wrap { width:110px; height:110px; } .gn-modal-title { font-size:15px; letter-spacing:2px; } .gn-pbar-track { height:8px; } .gn-msg { font-size:10.5px; } }
    `]
  })
  export class LoadingModalComponent {
    @Input() mode: 'login' | 'register' | 'link' = 'register';   // ✅ agregado 'link'
    @Input() progress = 0;
    @Input() progressMsgs: string[] = [];
    @Input() loadingSuccess = false;
    @Input() loadingError = '';
    @Input() elapsedTime = 0;
    @Output() closeModal = new EventEmitter<void>();
    trackByIndex(index: number): number { return index; }
  }