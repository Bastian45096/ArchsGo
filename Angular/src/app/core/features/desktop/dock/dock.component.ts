import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopStateService } from '../services/desktop-state.service';

@Component({
  selector: 'app-dock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dock">
      <button class="dk" [class.dk-on]="state.isOpen('terminal')" (click)="state.open('terminal')" title="Terminal">
        <div class="dk-box dk-term">
          <svg viewBox="0 0 52 52" fill="none">
            <rect x="4" y="6" width="44" height="40" rx="5" fill="#0e0e18" stroke="#28c840" stroke-width="2.5"/>
            <rect x="4" y="6" width="44" height="9" rx="5" fill="rgba(40,200,64,0.1)"/>
            <circle cx="12" cy="11" r="2.5" fill="#ff5f57"/>
            <circle cx="19" cy="11" r="2.5" fill="#febc2e"/>
            <circle cx="26" cy="11" r="2.5" fill="#28c840"/>
            <polyline points="15,26 22,33 15,40" stroke="#28c840" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="26" y1="40" x2="38" y2="40" stroke="#28c840" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
        @if (state.isOpen('terminal')) { <div class="dk-dot"></div> }
      </button>
      <button class="dk" [class.dk-on]="state.isOpen('archtx')" (click)="state.open('archtx')" title="ArchTX">
        <div class="dk-box dk-arch">
          <svg viewBox="0 0 52 52" fill="none">
            <defs>
              <linearGradient id="ag4" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#DD0031"/>
                <stop offset="50%" stop-color="#a040b0"/>
                <stop offset="100%" stop-color="#1793D1"/>
              </linearGradient>
            </defs>
            <path d="M26 4 L46 13 L46 31 Q46 44 26 50 Q6 44 6 31 L6 13 Z" fill="#0e0e18" stroke="url(#ag4)" stroke-width="2"/>
            <path d="M15 17 L9 26 L15 35" stroke="#DD0031" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M37 17 L43 26 L37 35" stroke="#1793D1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="22" y1="20" x2="30" y2="34" stroke="#a040b0" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="26" cy="26" r="4" fill="none" stroke="url(#ag4)" stroke-width="2"/>
          </svg>
        </div>
        @if (state.isOpen('archtx')) { <div class="dk-dot"></div> }
      </button>
    </div>
  `,
  styles: [`
    :host { display:block; }
    .dock { position:fixed; bottom:8px; left:50%; transform:translateX(-50%); display:flex; gap:8px; padding:6px 18px; background:rgba(10,10,16,0.82); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.08); border-radius:18px; z-index:999; }
    .dk { position:relative; width:52px; height:52px; background:none; border:none; cursor:pointer; border-radius:12px; display:flex; align-items:center; justify-content:center; transition:all 0.2s cubic-bezier(0.16,1,0.3,1); }
    .dk:hover { transform:translateY(-8px) scale(1.18); background:rgba(255,255,255,0.08); }
    .dk-box { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; }
    .dk-box svg { width:100%; height:100%; display:block; }
    .dk-term { background:rgba(40,200,64,0.08); }
    .dk-arch { background:rgba(221,0,49,0.06); }
    .dk-dot { position:absolute; bottom:2px; width:5px; height:5px; border-radius:50%; background:#1793D1; box-shadow:0 0 8px rgba(23,147,209,0.5); }
  `]
})
export class DockComponent {
  state = inject(DesktopStateService);
}