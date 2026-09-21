import { Component, inject, OnInit, HostListener } from '@angular/core';
import { DesktopStateService } from './services/desktop-state.service';
import { TopbarComponent } from './topbar/topbar.component';
import { DockComponent } from './dock/dock.component';
import { LauncherComponent } from './launcher/launcher.component';
import { WindowFrameComponent } from './window-frame/window-frame.component';
import { TerminalAppComponent } from './apps/terminal-app/terminal-app.component';
import { ArchTxAppComponent } from './apps/archtx-app/archtx-app.component';
import { DesktopIconsComponent } from './desktop-icons/desktop-icons.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { NotificationComponent } from './notification/notification.component';
import { GoNetAppComponent } from './apps/gonet-app/gonet-app.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TopbarComponent,
    DockComponent,
    LauncherComponent,
    WindowFrameComponent,
    TerminalAppComponent,
    ArchTxAppComponent,
    DesktopIconsComponent,
    ContextMenuComponent,
    NotificationComponent,
    GoNetAppComponent
  ],
  template: `
    <div class="os" (contextmenu)="state.ctxOpen($event)">

      <!-- WALLPAPER -->
      <div class="wp">
        <div class="wp-mesh"></div>
        <div class="wp-glow g1"></div>
        <div class="wp-glow g2"></div>
      </div>

      <!-- TOPBAR -->
      <app-topbar></app-topbar>

      <!-- DESKTOP ICONS -->
      <app-desktop-icons></app-desktop-icons>

      <!-- WINDOWS -->
      @for (w of state.wins(); track w.id) {
        <app-window-frame [w]="w" [vw]="vw" [vh]="vh">
          @if (w.id === 'terminal') {
            <app-terminal-app></app-terminal-app>
          }
          @if (w.id === 'archtx') {
            <app-archtx-app></app-archtx-app>
          }
          @if (w.id === 'gonet') {
            <app-gonet-app></app-gonet-app>
          }
        </app-window-frame>
      }

      <!-- DOCK -->
      <app-dock></app-dock>

      <!-- LAUNCHER -->
      @if (state.launcher()) {
        <app-launcher></app-launcher>
      }

      <!-- CONTEXT MENU -->
      <app-context-menu></app-context-menu>

      <!-- NOTIFICATION -->
      <app-notification></app-notification>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

    :host { display:block; width:100%; height:100vh; background:#0c0c14; overflow:hidden; }
    * { margin:0; padding:0; box-sizing:border-box; }

    .os { width:100%; height:100vh; font-family:'Chakra Petch',sans-serif; color:#e0e0ea; position:relative; overflow:hidden; user-select:none; }

    /* WALLPAPER */
    .wp { position:absolute; inset:0; background:#0c0c14; }
    .wp-mesh {
      position:absolute; inset:0;
      background:
        radial-gradient(ellipse 900px 700px at 20% 25%, rgba(221,0,49,0.14), transparent),
        radial-gradient(ellipse 800px 600px at 80% 75%, rgba(23,147,209,0.12), transparent),
        radial-gradient(ellipse 600px 500px at 50% 50%, rgba(160,64,176,0.07), transparent);
    }
    .wp-glow { position:absolute; border-radius:50%; filter:blur(100px); }
    .g1 { width:500px; height:500px; top:-10%; left:-5%; background:rgba(221,0,49,0.2); animation:wf 20s ease-in-out infinite alternate; }
    .g2 { width:600px; height:600px; bottom:-15%; right:-5%; background:rgba(23,147,209,0.18); animation:wf 25s ease-in-out infinite alternate-reverse; }
    @keyframes wf { 0%{transform:translate(0,0)} 100%{transform:translate(40px,-30px)} }

    @media(max-width:768px) {
      :host { overflow:auto; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  state = inject(DesktopStateService);
  vw = window.innerWidth;
  vh = window.innerHeight;

  ngOnInit(): void {
    setTimeout(() => this.state.showNtf('Bienvenido', 'Tu escritorio est\u00e1 listo.'), 1500);
    this.state.loadInstalledApps();
    this.state.loadIconPositions();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.state.dragMove(e);
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.state.dragEnd();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.vw = window.innerWidth;
    this.vh = window.innerHeight;
  }
}