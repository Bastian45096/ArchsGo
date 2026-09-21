import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopStateService } from '../services/desktop-state.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="topbar">
      <div class="tb-l">
        <button class="tb-btn" (click)="state.launcher.set(!state.launcher())">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Actividades
        </button>
        @if (state.activeTitle()) {
          <span class="tb-app">{{ state.activeTitle() }}</span>
        }
      </div>
      <div class="tb-c"><span class="tb-clk">{{ state.clk() }}</span></div>
      <div class="tb-r">
        <div class="tb-ind">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>
        </div>
        <div class="tb-ind">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="10" x2="23" y2="14"/></svg>
          <span>87%</span>
        </div>
        <div class="tb-ind">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        </div>
        <button class="tb-pwr" (click)="state.pwr.set(!state.pwr())">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
        </button>
        @if (state.pwr()) {
          <div class="pwr-menu">
            <button (click)="state.pwr.set(false)">Bloquear</button>
            <button (click)="state.pwr.set(false)">Cerrar Sesi&oacute;n</button>
            <div class="pwr-sep"></div>
            <button class="pwr-off" (click)="state.pwr.set(false)">Apagar</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display:block; }
    .topbar { position:fixed; top:0; left:0; right:0; height:32px; background:rgba(12,12,20,0.92); backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; justify-content:space-between; padding:0 12px; z-index:1000; font-family:'Chakra Petch',sans-serif; font-size:12px; color:#e0e0ea; user-select:none; }
    .tb-l,.tb-r { display:flex; align-items:center; gap:4px; }
    .tb-c { position:absolute; left:50%; transform:translateX(-50%); }
    .tb-btn { background:none; border:none; color:#e0e0ea; cursor:pointer; font-family:'Chakra Petch',sans-serif; font-size:12px; font-weight:500; padding:4px 10px; border-radius:6px; display:flex; align-items:center; gap:6px; transition:background 0.2s; }
    .tb-btn:hover { background:rgba(255,255,255,0.08); }
    .tb-app { font-weight:600; margin-left:8px; }
    .tb-clk { font-family:'JetBrains Mono',monospace; }
    .tb-ind { display:flex; align-items:center; gap:4px; padding:3px 8px; border-radius:6px; color:#aaa; font-size:11px; font-family:'JetBrains Mono',monospace; }
    .tb-pwr { background:none; border:none; color:#aaa; cursor:pointer; padding:4px; border-radius:6px; display:flex; transition:all 0.2s; }
    .tb-pwr:hover { background:rgba(221,0,49,0.15); color:#DD0031; }
    .pwr-menu { position:absolute; top:32px; right:8px; background:rgba(14,14,22,0.97); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:6px; min-width:170px; z-index:1001; animation:mi 0.15s ease; }
    @keyframes mi { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
    .pwr-menu button { width:100%; padding:8px 12px; background:none; border:none; color:#e0e0ea; font-family:'Chakra Petch',sans-serif; font-size:12px; cursor:pointer; border-radius:6px; text-align:left; transition:background 0.15s; }
    .pwr-menu button:hover { background:rgba(255,255,255,0.06); }
    .pwr-off:hover { background:rgba(221,0,49,0.12)!important; color:#DD0031; }
    .pwr-sep { height:1px; background:rgba(255,255,255,0.05); margin:4px 8px; }
  `]
})
export class TopbarComponent implements OnInit, OnDestroy {
  state = inject(DesktopStateService);
  private ci: any;

  ngOnInit(): void {
    this.tick();
    this.ci = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void { clearInterval(this.ci); }

  private tick(): void {
    const n = new Date();
    const d = ['Dom','Lun','Mar','Mi\u00e9','Jue','Vie','S\u00e1b'];
    const m = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    this.state.clk.set(`${d[n.getDay()]} ${n.getDate()} ${m[n.getMonth()]}  ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`);
  }
}