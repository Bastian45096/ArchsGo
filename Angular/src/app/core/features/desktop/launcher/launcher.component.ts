import { Component, inject } from '@angular/core';
import { DesktopStateService } from '../services/desktop-state.service';

@Component({
  selector: 'app-launcher',
  standalone: true,
  template: `
    <div class="lbg" (click)="state.launcher.set(false)">
      <div class="launch" (click)="$event.stopPropagation()">
        <div class="lsearch">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar..." spellcheck="false">
        </div>
        <div class="lgrid">
          <button class="lapp" (click)="state.open('terminal'); state.launcher.set(false)">
            <div class="la-box la-term">
              <svg viewBox="0 0 52 52" fill="none">
                <rect x="4" y="6" width="44" height="40" rx="5" fill="#0e0e18" stroke="#28c840" stroke-width="2.5"/>
                <circle cx="12" cy="11" r="2.5" fill="#ff5f57"/>
                <circle cx="19" cy="11" r="2.5" fill="#febc2e"/>
                <circle cx="26" cy="11" r="2.5" fill="#28c840"/>
                <polyline points="15,26 22,33 15,40" stroke="#28c840" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="26" y1="40" x2="38" y2="40" stroke="#28c840" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </div>
            <span>Terminal</span>
          </button>
          <button class="lapp" (click)="state.open('archtx'); state.launcher.set(false)">
            <div class="la-box la-arch">
              <svg viewBox="0 0 52 52" fill="none">
                <defs>
                  <linearGradient id="ag5" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#DD0031"/>
                    <stop offset="50%" stop-color="#a040b0"/>
                    <stop offset="100%" stop-color="#1793D1"/>
                  </linearGradient>
                </defs>
                <path d="M26 4 L46 13 L46 31 Q46 44 26 50 Q6 44 6 31 L6 13 Z" fill="#0e0e18" stroke="url(#ag5)" stroke-width="2"/>
                <path d="M15 17 L9 26 L15 35" stroke="#DD0031" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M37 17 L43 26 L37 35" stroke="#1793D1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="22" y1="20" x2="30" y2="34" stroke="#a040b0" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="26" cy="26" r="4" fill="none" stroke="url(#ag5)" stroke-width="2"/>
              </svg>
            </div>
            <span>ArchTX</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display:block; }
    .lbg { position:fixed; inset:0; background:rgba(0,0,0,0.55); backdrop-filter:blur(10px); z-index:2000; display:flex; align-items:flex-start; justify-content:center; padding-top:80px; animation:fi 0.2s ease; }
    @keyframes fi { from{opacity:0} to{opacity:1} }
    .launch { width:380px; background:rgba(14,14,22,0.97); backdrop-filter:blur(30px); border:1px solid rgba(255,255,255,0.08); border-radius:16px; overflow:hidden; animation:li 0.25s cubic-bezier(0.16,1,0.3,1); }
    @keyframes li { from{opacity:0;transform:translateY(-20px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    .lsearch { display:flex; align-items:center; gap:10px; padding:14px 18px; border-bottom:1px solid rgba(255,255,255,0.05); color:#777; }
    .lsearch input { flex:1; background:none; border:none; color:#e0e0ea; font-family:'Chakra Petch',sans-serif; font-size:15px; outline:none; }
    .lsearch input::placeholder { color:#444; }
    .lgrid { display:grid; grid-template-columns:repeat(2,1fr); gap:4px; padding:12px; }
    .lapp { display:flex; flex-direction:column; align-items:center; gap:8px; padding:20px 8px; background:none; border:none; cursor:pointer; border-radius:10px; transition:background 0.15s; }
    .lapp:hover { background:rgba(255,255,255,0.06); }
    .la-box { width:48px; height:48px; border-radius:10px; display:flex; align-items:center; justify-content:center; }
    .la-box svg { width:100%; height:100%; display:block; }
    .la-term { background:rgba(40,200,64,0.08); border:1px solid rgba(40,200,64,0.15); }
    .la-arch { background:rgba(221,0,49,0.06); border:1px solid rgba(221,0,49,0.12); }
    .lapp span { font-size:12px; color:#aaa; font-family:'Chakra Petch',sans-serif; }
  `]
})
export class LauncherComponent {
  state = inject(DesktopStateService);
}