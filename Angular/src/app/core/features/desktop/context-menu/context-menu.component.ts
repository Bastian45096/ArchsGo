import { Component, inject } from '@angular/core';
import { DesktopStateService } from '../services/desktop-state.service';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  template: `
    @if (state.ctx().s) {
      <div class="ctxbg" (click)="state.ctxClose()"></div>
      <div class="ctx" [style.left.px]="state.ctx().x" [style.top.px]="state.ctx().y">
        <button (click)="state.open('terminal'); state.ctxClose()">Abrir Terminal</button>
        <button (click)="state.open('archtx'); state.ctxClose()">Abrir ArchTX</button>
      </div>
    }
  `,
  styles: [`
    :host { display:block; }
    .ctxbg { position:fixed; inset:0; z-index:1500; }
    .ctx { position:fixed; background:rgba(14,14,22,0.97); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:6px; min-width:180px; z-index:1501; animation:mi 0.12s ease; }
    @keyframes mi { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
    .ctx button { width:100%; padding:8px 12px; background:none; border:none; color:#e0e0ea; font-family:'Chakra Petch',sans-serif; font-size:12px; cursor:pointer; border-radius:6px; text-align:left; transition:background 0.15s; }
    .ctx button:hover { background:rgba(255,255,255,0.06); }
  `]
})
export class ContextMenuComponent {
  state = inject(DesktopStateService);
}