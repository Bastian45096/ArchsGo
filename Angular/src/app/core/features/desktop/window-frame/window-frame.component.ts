import { Component, Input, inject } from '@angular/core';
import { DesktopStateService, Win } from '../services/desktop-state.service';

@Component({
  selector: 'app-window-frame',
  standalone: true,
  template: `
    @if (!w.min) {
      <div class="win"
           [class.win-max]="w.max"
           [style.left.px]="w.max ? 0 : w.x"
           [style.top.px]="w.max ? 32 : w.y"
           [style.width.px]="w.max ? vw : w.w"
           [style.height.px]="w.max ? vh - 32 : w.h"
           [style.z-index]="w.z"
           (mousedown)="state.focus(w.id)">

        <div class="wbar" (mousedown)="onDrag($event)">
          <div class="wdots">
            <span class="wd wd-c" (click)="state.close(w.id)"></span>
            <span class="wd wd-m" (click)="state.mini(w.id)"></span>
            <span class="wd wd-x" (click)="state.toggMax(w.id)"></span>
          </div>
          <span class="wtitle">{{ w.title }}</span>
          <div class="wspacer"></div>
        </div>

        <div class="wbody">
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display:block; }
    .win { position:absolute; background:rgba(14,14,22,0.97); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.08); border-radius:12px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 16px 48px rgba(0,0,0,0.6); animation:wi 0.2s ease; }
    .win-max { border-radius:0; }
    @keyframes wi { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
    .wbar { height:38px; background:rgba(10,10,16,0.9); border-bottom:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; padding:0 12px; flex-shrink:0; cursor:default; }
    .wdots { display:flex; gap:7px; margin-right:12px; }
    .wd { width:12px; height:12px; border-radius:50%; cursor:pointer; transition:filter 0.2s; }
    .wd-c { background:#ff5f57; }
    .wd-m { background:#febc2e; }
    .wd-x { background:#28c840; }
    .wd:hover { filter:brightness(1.3); }
    .wtitle { flex:1; text-align:center; font-family:'Chakra Petch',sans-serif; font-size:12px; font-weight:500; color:#aaa; letter-spacing:0.5px; }
    .wspacer { width:60px; }
    .wbody { flex:1; overflow:hidden; }
  `]
})
export class WindowFrameComponent {
  @Input({ required: true }) w!: Win;
  @Input() vw = window.innerWidth;
  @Input() vh = window.innerHeight;

  state = inject(DesktopStateService);

  onDrag(e: MouseEvent): void {
    this.state.dragStart(e, this.w.id);
  }
}