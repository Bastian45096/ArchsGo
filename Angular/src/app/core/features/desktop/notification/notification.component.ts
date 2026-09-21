import { Component, inject } from '@angular/core';
import { DesktopStateService } from '../services/desktop-state.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  template: `
    @if (state.ntf().s) {
      <div class="ntf">
        <svg width="24" height="24" viewBox="0 0 52 52" fill="none" class="ntf-ico">
          <defs>
            <linearGradient id="ag6" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#DD0031"/>
              <stop offset="50%" stop-color="#a040b0"/>
              <stop offset="100%" stop-color="#1793D1"/>
            </linearGradient>
          </defs>
          <path d="M26 4 L46 13 L46 31 Q46 44 26 50 Q6 44 6 31 L6 13 Z" fill="#0e0e18" stroke="url(#ag6)" stroke-width="2"/>
          <path d="M15 17 L9 26 L15 35" stroke="#DD0031" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M37 17 L43 26 L37 35" stroke="#1793D1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="22" y1="20" x2="30" y2="34" stroke="#a040b0" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="26" cy="26" r="4" fill="none" stroke="url(#ag6)" stroke-width="2"/>
        </svg>
        <div>
          <strong>{{ state.ntf().t }}</strong>
          <p>{{ state.ntf().m }}</p>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display:block; }
    .ntf { position:fixed; top:44px; right:12px; display:flex; align-items:center; gap:12px; padding:14px 18px; background:rgba(14,14,22,0.97); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.08); border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.5); z-index:3000; animation:ns 0.3s cubic-bezier(0.16,1,0.3,1); max-width:300px; }
    @keyframes ns { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
    .ntf-ico { flex-shrink:0; }
    .ntf strong { display:block; font-family:'Chakra Petch',sans-serif; font-size:13px; margin-bottom:2px; color:#e0e0ea; }
    .ntf p { font-family:'Chakra Petch',sans-serif; font-size:11px; color:#aaa; line-height:1.4; }
  `]
})
export class NotificationComponent {
  state = inject(DesktopStateService);
}