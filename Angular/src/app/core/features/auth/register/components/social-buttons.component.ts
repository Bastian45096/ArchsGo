import { Component } from '@angular/core';

@Component({
  selector: 'app-social-buttons',
  standalone: true,
  template: `
    <div class="socials">
      <button class="soc" type="button">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        GitHub
      </button>
      <button class="soc" type="button">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.43.43 0 0 1 4.82 2a.42.42 0 0 1 .58.19L8.49 9.3l3.09 2.28a.76.76 0 0 0 .92 0l3.09-2.28 3.09-7.11a.42.42 0 0 1 .58-.19.43.43 0 0 1 .11.11l2.44 7.51 1.22 3.78a.84.84 0 0 1-.29.94z"/></svg>
        GitLab
      </button>
    </div>
  `,
  styles: [`
    :host { display:block; }
    .socials { display:flex; gap:10px; opacity:0; animation:slideR 0.5s ease 1s forwards; }
    @keyframes slideR { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
    .soc { flex:1; padding:11px; border:1px solid rgba(255,255,255,0.06); border-radius:8px; background:#10101c; color:#555568; cursor:pointer; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.5px; display:flex; align-items:center; justify-content:center; gap:7px; transition:all 0.3s; }
    .soc:hover { border-color:rgba(255,255,255,0.1); color:#dcdce4; transform:translateY(-1px); }
    .soc svg { width:15px; height:15px; }
  `]
})
export class SocialButtonsComponent {}