import { Component } from '@angular/core';

@Component({
  selector: 'app-archtx-app',
  standalone: true,
  template: `
    <div class="atx">
      <div class="atx-side">
        <div class="atx-head">
          <svg width="26" height="26" viewBox="0 0 52 52" fill="none">
            <defs>
              <linearGradient id="ag2" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#DD0031"/>
                <stop offset="50%" stop-color="#a040b0"/>
                <stop offset="100%" stop-color="#1793D1"/>
              </linearGradient>
            </defs>
            <path d="M26 4 L46 13 L46 31 Q46 44 26 50 Q6 44 6 31 L6 13 Z" fill="#0e0e18" stroke="url(#ag2)" stroke-width="2"/>
            <path d="M15 17 L9 26 L15 35" stroke="#DD0031" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M37 17 L43 26 L37 35" stroke="#1793D1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="22" y1="20" x2="30" y2="34" stroke="#a040b0" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="26" cy="26" r="4" fill="none" stroke="url(#ag2)" stroke-width="2"/>
          </svg>
          <span>ArchTX</span>
        </div>
        <nav class="atx-nav">
          <button class="atx-n active">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Inicio
          </button>
          <button class="atx-n">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Proyectos
          </button>
          <button class="atx-n">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Archivos
          </button>
          <button class="atx-n">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4"/></svg>
            Ajustes
          </button>
        </nav>
        <div class="atx-foot"><span class="atx-ver">v2.0.0</span></div>
      </div>

      <div class="atx-main">
        <div class="atx-welcome">
          <svg width="64" height="64" viewBox="0 0 52 52" fill="none">
            <defs>
              <linearGradient id="ag3" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#DD0031"/>
                <stop offset="50%" stop-color="#a040b0"/>
                <stop offset="100%" stop-color="#1793D1"/>
              </linearGradient>
            </defs>
            <path d="M26 4 L46 13 L46 31 Q46 44 26 50 Q6 44 6 31 L6 13 Z" fill="#0e0e18" stroke="url(#ag3)" stroke-width="2"/>
            <path d="M15 17 L9 26 L15 35" stroke="#DD0031" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M37 17 L43 26 L37 35" stroke="#1793D1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="22" y1="20" x2="30" y2="34" stroke="#a040b0" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="26" cy="26" r="4" fill="none" stroke="url(#ag3)" stroke-width="2"/>
          </svg>
          <h2>Bienvenido a <span>ArchTX</span></h2>
          <p>Tu entorno de desarrollo integrado. Construye, despliega y conquista.</p>
        </div>

        <div class="atx-cards">
          <div class="atx-card">
            <div class="ac-ico ac-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div class="ac-info"><strong>7</strong><small>Proyectos activos</small></div>
          </div>
          <div class="atx-card">
            <div class="ac-ico ac-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            </div>
            <div class="ac-info"><strong>1.2k</strong><small>Commits este mes</small></div>
          </div>
          <div class="atx-card">
            <div class="ac-ico ac-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div class="ac-info"><strong>99.9%</strong><small>Uptime</small></div>
          </div>
          <div class="atx-card">
            <div class="ac-ico ac-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="ac-info"><strong>12</strong><small>Colaboradores</small></div>
          </div>
        </div>

        <div class="atx-activity">
          <h3>Actividad reciente</h3>
          <div class="atx-act-list">
            @for (a of activity; track a.msg) {
              <div class="act-row">
                <div class="act-dot" [style.background]="a.color"></div>
                <div class="act-info">
                  <span class="act-msg">{{ a.msg }}</span>
                  <span class="act-time">{{ a.time }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display:block; height:100%; }
    .atx { height:100%; display:flex; background:#08080e; }
    .atx-side { width:190px; background:rgba(0,0,0,0.35); border-right:1px solid rgba(255,255,255,0.05); display:flex; flex-direction:column; flex-shrink:0; }
    .atx-head { display:flex; align-items:center; gap:10px; padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.05); }
    .atx-head svg { flex-shrink:0; }
    .atx-head span { font-family:'Chakra Petch',sans-serif; font-size:15px; font-weight:700; letter-spacing:2px; background:linear-gradient(135deg,#DD0031,#a040b0,#1793D1); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .atx-nav { flex:1; padding:10px 8px; display:flex; flex-direction:column; gap:2px; }
    .atx-n { width:100%; display:flex; align-items:center; gap:10px; padding:9px 12px; background:none; border:none; color:#777; font-family:'Chakra Petch',sans-serif; font-size:12px; cursor:pointer; border-radius:6px; transition:all 0.15s; }
    .atx-n:hover { background:rgba(255,255,255,0.04); color:#bbb; }
    .atx-n.active { background:rgba(221,0,49,0.08); color:#DD0031; }
    .atx-foot { padding:12px 16px; border-top:1px solid rgba(255,255,255,0.05); }
    .atx-ver { font-family:'JetBrains Mono',monospace; font-size:10px; color:#444; letter-spacing:1px; }
    .atx-main { flex:1; display:flex; flex-direction:column; overflow-y:auto; padding:24px; gap:24px; }
    .atx-main::-webkit-scrollbar { width:6px; }
    .atx-main::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:3px; }
    .atx-welcome { text-align:center; padding:20px 0 8px; }
    .atx-welcome svg { opacity:0.8; margin-bottom:16px; }
    .atx-welcome h2 { font-family:'Chakra Petch',sans-serif; font-size:22px; font-weight:700; color:#e0e0ea; margin-bottom:6px; }
    .atx-welcome h2 span { background:linear-gradient(135deg,#DD0031,#a040b0,#1793D1); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .atx-welcome p { font-family:'Chakra Petch',sans-serif; font-size:13px; color:#777; max-width:340px; margin:0 auto; line-height:1.5; }
    .atx-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
    .atx-card { display:flex; align-items:center; gap:12px; padding:14px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:10px; transition:border-color 0.2s; }
    .atx-card:hover { border-color:rgba(255,255,255,0.1); }
    .ac-ico { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ac-1 { background:rgba(221,0,49,0.1); color:#DD0031; }
    .ac-2 { background:rgba(23,147,209,0.1); color:#1793D1; }
    .ac-3 { background:rgba(40,200,64,0.1); color:#28c840; }
    .ac-4 { background:rgba(160,64,176,0.1); color:#a040b0; }
    .ac-info strong { display:block; font-size:20px; color:#e0e0ea; line-height:1.2; }
    .ac-info small { font-family:'JetBrains Mono',monospace; font-size:10px; color:#666; letter-spacing:0.3px; }
    .atx-activity { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:10px; padding:16px; }
    .atx-activity h3 { font-family:'Chakra Petch',sans-serif; font-size:14px; font-weight:600; color:#aaa; margin-bottom:14px; }
    .atx-act-list { display:flex; flex-direction:column; }
    .act-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.03); }
    .act-row:last-child { border-bottom:none; }
    .act-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .act-info { display:flex; justify-content:space-between; align-items:center; flex:1; }
    .act-msg { font-family:'Chakra Petch',sans-serif; font-size:12px; color:#bbb; }
    .act-time { font-family:'JetBrains Mono',monospace; font-size:10px; color:#555; }
  `]
})
export class ArchTxAppComponent {
  activity = [
    { msg: 'Push a main \u2014 feat: login component', time: 'Hace 12min', color: '#28c840' },
    { msg: 'Merge PR #47 \u2014 dashboard layout', time: 'Hace 1h', color: '#1793D1' },
    { msg: 'Deploy v2.0.0 a producci\u00f3n', time: 'Hace 3h', color: '#DD0031' },
    { msg: 'Nuevo colaborador: maki', time: 'Hace 5h', color: '#a040b0' },
    { msg: 'Build exitoso \u2014 0 errores', time: 'Hace 6h', color: '#28c840' },
  ];
}