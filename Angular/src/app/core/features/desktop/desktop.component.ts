import { Component, signal, computed, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Win {
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  min: boolean;
  max: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="os" (contextmenu)="ctxOpen($event)">

      <!-- WALLPAPER -->
      <div class="wp">
        <div class="wp-mesh"></div>
        <div class="wp-glow g1"></div>
        <div class="wp-glow g2"></div>
      </div>

      <!-- TOPBAR -->
      <div class="topbar">
        <div class="tb-l">
          <button class="tb-btn" (click)="launcher.set(!launcher())">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Actividades
          </button>
          @if (activeTitle()) {
            <span class="tb-app">{{ activeTitle() }}</span>
          }
        </div>
        <div class="tb-c"><span class="tb-clk">{{ clk() }}</span></div>
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
          <button class="tb-pwr" (click)="pwr.set(!pwr())">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
          </button>
          @if (pwr()) {
            <div class="pwr-menu">
              <button (click)="pwr.set(false)">Bloquear</button>
              <button (click)="pwr.set(false)">Cerrar Sesi&oacute;n</button>
              <div class="pwr-sep"></div>
              <button class="pwr-off" (click)="pwr.set(false)">Apagar</button>
            </div>
          }
        </div>
      </div>

      <!-- DESKTOP ICONS -->
      <div class="desk">
        <!-- TERMINAL ICON -->
        <button class="dicon" (dblclick)="open('terminal')">
          <div class="di-box di-term">
            <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="6" width="44" height="40" rx="5" fill="#0e0e18" stroke="#28c840" stroke-width="2.5"/>
              <rect x="4" y="6" width="44" height="9" rx="5" fill="rgba(40,200,64,0.1)"/>
              <circle cx="12" cy="11" r="2.5" fill="#ff5f57"/>
              <circle cx="19" cy="11" r="2.5" fill="#febc2e"/>
              <circle cx="26" cy="11" r="2.5" fill="#28c840"/>
              <polyline points="15,26 22,33 15,40" stroke="#28c840" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="26" y1="40" x2="38" y2="40" stroke="#28c840" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <span>Terminal</span>
        </button>

        <!-- ARCHTX ICON -->
        <button class="dicon" (dblclick)="open('archtx')">
          <div class="di-box di-arch">
            <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#DD0031"/>
                  <stop offset="50%" stop-color="#a040b0"/>
                  <stop offset="100%" stop-color="#1793D1"/>
                </linearGradient>
              </defs>
              <path d="M26 4 L46 13 L46 31 Q46 44 26 50 Q6 44 6 31 L6 13 Z" fill="#0e0e18" stroke="url(#grad1)" stroke-width="2"/>
              <path d="M15 17 L9 26 L15 35" stroke="#DD0031" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M37 17 L43 26 L37 35" stroke="#1793D1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="22" y1="20" x2="30" y2="34" stroke="#a040b0" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="26" cy="26" r="4" fill="none" stroke="url(#grad1)" stroke-width="2"/>
            </svg>
          </div>
          <span>ArchTX</span>
        </button>
      </div>

      <!-- WINDOWS -->
      @for (w of wins(); track w.id) {
        @if (!w.min) {
          <div class="win"
               [class.win-max]="w.max"
               [style.left.px]="w.max ? 0 : w.x"
               [style.top.px]="w.max ? 32 : w.y"
               [style.width.px]="w.max ? vw : w.w"
               [style.height.px]="w.max ? vh - 32 : w.h"
               [style.z-index]="w.z"
               (mousedown)="focus(w.id)">

            <div class="wbar" (mousedown)="dragStart($event, w.id)">
              <div class="wdots">
                <span class="wd wd-c" (click)="close(w.id)"></span>
                <span class="wd wd-m" (click)="mini(w.id)"></span>
                <span class="wd wd-x" (click)="toggMax(w.id)"></span>
              </div>
              <span class="wtitle">{{ w.title }}</span>
              <div class="wspacer"></div>
            </div>

            <div class="wbody">

              @if (w.id === 'terminal') {
                <div class="term">
                  <div class="tout">
                    @for (l of tLines(); track $index) {
                      <div class="tl" [class.tl-o]="l.t==='o'" [class.tl-e]="l.t==='e'" [class.tl-s]="l.t==='s'">
                        @if (l.t==='p') {
                          <span class="tu">archsgo</span><span class="tc">:</span><span class="tp">~</span><span class="td">$ </span>
                        }
                        <span [innerHTML]="l.v"></span>
                      </div>
                    }
                  </div>
                  <div class="tinp">
                    <span class="tu">archsgo</span><span class="tc">:</span><span class="tp">~</span><span class="td">$ </span>
                    <input [(ngModel)]="tInp" (keydown.enter)="runCmd()" spellcheck="false" autocomplete="off">
                  </div>
                </div>
              }

              @if (w.id === 'archtx') {
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
              }

            </div>
          </div>
        }
      }

      <!-- DOCK -->
      <div class="dock">
        <button class="dk" [class.dk-on]="isOpen('terminal')" (click)="open('terminal')" title="Terminal">
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
          @if (isOpen('terminal')) { <div class="dk-dot"></div> }
        </button>
        <button class="dk" [class.dk-on]="isOpen('archtx')" (click)="open('archtx')" title="ArchTX">
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
          @if (isOpen('archtx')) { <div class="dk-dot"></div> }
        </button>
      </div>

      <!-- LAUNCHER -->
      @if (launcher()) {
        <div class="lbg" (click)="launcher.set(false)">
          <div class="launch" (click)="$event.stopPropagation()">
            <div class="lsearch">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Buscar..." spellcheck="false">
            </div>
            <div class="lgrid">
              <button class="lapp" (click)="open('terminal'); launcher.set(false)">
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
              <button class="lapp" (click)="open('archtx'); launcher.set(false)">
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
      }

      <!-- CTX -->
      @if (ctx().s) {
        <div class="ctxbg" (click)="ctxClose()"></div>
        <div class="ctx" [style.left.px]="ctx().x" [style.top.px]="ctx().y">
          <button (click)="open('terminal'); ctxClose()">Abrir Terminal</button>
          <button (click)="open('archtx'); ctxClose()">Abrir ArchTX</button>
        </div>
      }

      <!-- NOTIF -->
      @if (ntf().s) {
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
          <div><strong>{{ ntf().t }}</strong><p>{{ ntf().m }}</p></div>
        </div>
      }

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

    :host { display:block; width:100%; height:100vh; background:#0c0c14; overflow:hidden; }
    * { margin:0; padding:0; box-sizing:border-box; }

    .os { width:100%; height:100vh; font-family:'Chakra Petch',sans-serif; color:#e0e0ea; position:relative; overflow:hidden; user-select:none; }

    /* ═══ WALLPAPER ═══ */
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

    /* ═══ TOPBAR ═══ */
    .topbar { position:fixed; top:0; left:0; right:0; height:32px; background:rgba(12,12,20,0.92); backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; justify-content:space-between; padding:0 12px; z-index:1000; font-size:12px; }
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

    /* ═══ DESKTOP ICONS ═══ */
    .desk { position:absolute; top:48px; left:20px; display:flex; flex-direction:column; gap:12px; z-index:10; }
    .dicon {
      display:flex; flex-direction:column; align-items:center; gap:8px;
      background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06);
      cursor:pointer; border-radius:14px; padding:14px 18px;
      transition:all 0.2s; width:96px;
    }
    .dicon:hover { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.12); transform:translateY(-2px); }
    .di-box {
      width:56px; height:56px; border-radius:12px;
      display:flex; align-items:center; justify-content:center;
      padding:4px;
    }
    .di-box svg { width:100%; height:100%; display:block; }
    .di-term { background:rgba(40,200,64,0.08); border:1px solid rgba(40,200,64,0.15); }
    .di-arch { background:rgba(221,0,49,0.06); border:1px solid rgba(221,0,49,0.12); }
    .dicon span {
      font-size:11px; text-align:center;
      text-shadow:0 2px 8px rgba(0,0,0,1);
      font-weight:600; letter-spacing:0.5px; color:#e0e0ea;
    }

    /* ═══ WINDOWS ═══ */
    .win { position:absolute; background:rgba(14,14,22,0.97); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.08); border-radius:12px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 16px 48px rgba(0,0,0,0.6); animation:wi 0.2s ease; }
    .win-max { border-radius:0; }
    @keyframes wi { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
    .wbar { height:38px; background:rgba(10,10,16,0.9); border-bottom:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; padding:0 12px; flex-shrink:0; }
    .wdots { display:flex; gap:7px; margin-right:12px; }
    .wd { width:12px; height:12px; border-radius:50%; cursor:pointer; transition:filter 0.2s; }
    .wd-c { background:#ff5f57; }
    .wd-m { background:#febc2e; }
    .wd-x { background:#28c840; }
    .wd:hover { filter:brightness(1.3); }
    .wtitle { flex:1; text-align:center; font-size:12px; font-weight:500; color:#aaa; letter-spacing:0.5px; }
    .wspacer { width:60px; }
    .wbody { flex:1; overflow:hidden; }

    /* ═══ TERMINAL ═══ */
    .term { height:100%; display:flex; flex-direction:column; background:#08080e; }
    .tout { flex:1; overflow-y:auto; padding:12px 14px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; }
    .tout::-webkit-scrollbar { width:6px; }
    .tout::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:3px; }
    .tl { white-space:pre-wrap; word-break:break-all; }
    .tu { color:#28c840; }
    .tc { color:#666; }
    .tp { color:#1793D1; }
    .td { color:#e0e0ea; }
    .tl-o { color:#aaa; }
    .tl-e { color:#DD0031; }
    .tl-s { color:#28c840; }
    .tinp { display:flex; align-items:center; padding:8px 14px 12px; font-family:'JetBrains Mono',monospace; font-size:12px; border-top:1px solid rgba(255,255,255,0.04); }
    .tinp input { flex:1; background:none; border:none; color:#e0e0ea; font-family:'JetBrains Mono',monospace; font-size:12px; outline:none; caret-color:#28c840; }

    /* ═══ ARCHTX ═══ */
    .atx { height:100%; display:flex; background:#08080e; }
    .atx-side { width:190px; background:rgba(0,0,0,0.35); border-right:1px solid rgba(255,255,255,0.05); display:flex; flex-direction:column; flex-shrink:0; }
    .atx-head { display:flex; align-items:center; gap:10px; padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.05); }
    .atx-head svg { flex-shrink:0; }
    .atx-head span { font-size:15px; font-weight:700; letter-spacing:2px; background:linear-gradient(135deg,#DD0031,#a040b0,#1793D1); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
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
    .atx-welcome h2 { font-size:22px; font-weight:700; color:#e0e0ea; margin-bottom:6px; }
    .atx-welcome h2 span { background:linear-gradient(135deg,#DD0031,#a040b0,#1793D1); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .atx-welcome p { font-size:13px; color:#777; max-width:340px; margin:0 auto; line-height:1.5; }
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
    .atx-activity h3 { font-size:14px; font-weight:600; color:#aaa; margin-bottom:14px; }
    .atx-act-list { display:flex; flex-direction:column; }
    .act-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.03); }
    .act-row:last-child { border-bottom:none; }
    .act-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .act-info { display:flex; justify-content:space-between; align-items:center; flex:1; }
    .act-msg { font-size:12px; color:#bbb; }
    .act-time { font-family:'JetBrains Mono',monospace; font-size:10px; color:#555; }

    /* ═══ DOCK ═══ */
    .dock { position:fixed; bottom:8px; left:50%; transform:translateX(-50%); display:flex; gap:8px; padding:6px 18px; background:rgba(10,10,16,0.82); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.08); border-radius:18px; z-index:999; }
    .dk { position:relative; width:52px; height:52px; background:none; border:none; cursor:pointer; border-radius:12px; display:flex; align-items:center; justify-content:center; transition:all 0.2s cubic-bezier(0.16,1,0.3,1); }
    .dk:hover { transform:translateY(-8px) scale(1.18); background:rgba(255,255,255,0.08); }
    .dk-box { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; }
    .dk-box svg { width:100%; height:100%; display:block; }
    .dk-term { background:rgba(40,200,64,0.08); }
    .dk-arch { background:rgba(221,0,49,0.06); }
    .dk-dot { position:absolute; bottom:2px; width:5px; height:5px; border-radius:50%; background:#1793D1; box-shadow:0 0 8px rgba(23,147,209,0.5); }

    /* ═══ LAUNCHER ═══ */
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
    .lapp span { font-size:12px; color:#aaa; }

    /* ═══ CTX ═══ */
    .ctxbg { position:fixed; inset:0; z-index:1500; }
    .ctx { position:fixed; background:rgba(14,14,22,0.97); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:6px; min-width:180px; z-index:1501; animation:mi 0.12s ease; }
    .ctx button { width:100%; padding:8px 12px; background:none; border:none; color:#e0e0ea; font-family:'Chakra Petch',sans-serif; font-size:12px; cursor:pointer; border-radius:6px; text-align:left; transition:background 0.15s; }
    .ctx button:hover { background:rgba(255,255,255,0.06); }

    /* ═══ NOTIF ═══ */
    .ntf { position:fixed; top:44px; right:12px; display:flex; align-items:center; gap:12px; padding:14px 18px; background:rgba(14,14,22,0.97); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.08); border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.5); z-index:3000; animation:ns 0.3s cubic-bezier(0.16,1,0.3,1); max-width:300px; }
    @keyframes ns { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
    .ntf-ico { flex-shrink:0; }
    .ntf strong { display:block; font-size:13px; margin-bottom:2px; }
    .ntf p { font-size:11px; color:#aaa; line-height:1.4; }

    @media(max-width:768px) {
      .atx-cards { grid-template-columns:repeat(2,1fr); }
      .atx-side { width:150px; }
      .dock { padding:4px 12px; }
      .dk { width:44px; height:44px; }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  clk = signal('');
  launcher = signal(false);
  pwr = signal(false);
  tInp = '';
  vw = window.innerWidth;
  vh = window.innerHeight;
  private ci: any;
  private z = 100;
  private dg: { id: string; ox: number; oy: number } | null = null;

  wins = signal<Win[]>([]);
  ctx = signal({ s: false, x: 0, y: 0 });
  ntf = signal({ s: false, t: '', m: '' });

  activity = [
    { msg: 'Push a main \u2014 feat: login component', time: 'Hace 12min', color: '#28c840' },
    { msg: 'Merge PR #47 \u2014 dashboard layout', time: 'Hace 1h', color: '#1793D1' },
    { msg: 'Deploy v2.0.0 a producci\u00f3n', time: 'Hace 3h', color: '#DD0031' },
    { msg: 'Nuevo colaborador: maki', time: 'Hace 5h', color: '#a040b0' },
    { msg: 'Build exitoso \u2014 0 errores', time: 'Hace 6h', color: '#28c840' },
  ];

  tLines = signal<{t:string;v:string}[]>([
    { t:'o', v:'<span style="color:#DD0031">Arch</span><span style="color:#1793D1">sGo</span> <span style="color:#666">Linux 2.0 LTS (Kernel 6.10.2)</span>' },
    { t:'o', v:'<span style="color:#666">\u00daltimo login: '+new Date().toLocaleString()+'</span>' },
    { t:'o', v:'' },
  ]);

  activeTitle = computed(() => {
    const w = this.wins();
    if (!w.length) return '';
    const t = w.reduce((a,b) => a.z > b.z ? a : b);
    return t.min ? '' : t.title;
  });

  ngOnInit(): void {
    this.tick();
    this.ci = setInterval(() => this.tick(), 1000);
    setTimeout(() => this.showNtf('Bienvenido', 'Tu escritorio est\u00e1 listo.'), 1500);
  }

  ngOnDestroy(): void { clearInterval(this.ci); }

  @HostListener('document:mousemove',['$event'])
  mm(e: MouseEvent): void {
    if (this.dg) {
      this.wins.set(this.wins().map(w =>
        w.id === this.dg!.id && !w.max ? { ...w, x: e.clientX - this.dg!.ox, y: Math.max(32, e.clientY - this.dg!.oy) } : w
      ));
    }
  }

  @HostListener('document:mouseup')
  mu(): void { this.dg = null; }

  @HostListener('window:resize')
  rs(): void { this.vw = window.innerWidth; this.vh = window.innerHeight; }

  private tick(): void {
    const n = new Date();
    const d = ['Dom','Lun','Mar','Mi\u00e9','Jue','Vie','S\u00e1b'];
    const m = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    this.clk.set(`${d[n.getDay()]} ${n.getDate()} ${m[n.getMonth()]}  ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`);
  }

  open(id: string): void {
    const ex = this.wins().find(w => w.id === id);
    if (ex) {
      if (ex.min) this.wins.set(this.wins().map(w => w.id === id ? { ...w, min: false, z: ++this.z } : w));
      else this.focus(id);
      return;
    }
    const c: Record<string,any> = {
      terminal: { title:'Terminal', w:640, h:420 },
      archtx: { title:'ArchTX', w:800, h:520 },
    };
    const cfg = c[id] || { title:id, w:500, h:400 };
    const o = this.wins().length * 30;
    this.wins.set([...this.wins(), { id, title:cfg.title, x:100+o, y:50+o, w:cfg.w, h:cfg.h, z:++this.z, min:false, max:false }]);
  }

  close(id: string): void { this.wins.set(this.wins().filter(w => w.id !== id)); }
  mini(id: string): void { this.wins.set(this.wins().map(w => w.id === id ? { ...w, min: true } : w)); }
  toggMax(id: string): void { this.wins.set(this.wins().map(w => w.id === id ? { ...w, max: !w.max, z: ++this.z } : w)); }
  focus(id: string): void { this.wins.set(this.wins().map(w => w.id === id ? { ...w, z: ++this.z } : w)); }
  dragStart(e: MouseEvent, id: string): void {
    const w = this.wins().find(w => w.id === id);
    if (!w || w.max) return;
    this.dg = { id, ox: e.clientX - w.x, oy: e.clientY - w.y };
    this.focus(id);
  }
  isOpen(id: string): boolean { return this.wins().some(w => w.id === id); }

  runCmd(): void {
    const cmd = this.tInp.trim();
    if (!cmd) return;
    const ls = [...this.tLines(), { t:'p' as string, v:cmd }];
    const p = cmd.split(' ')[0];
    switch(p) {
      case 'help':
        ls.push({t:'o',v:'<span style="color:#1793D1">Comandos:</span>'});
        ls.push({t:'o',v:'  <span style="color:#28c840">neofetch</span>  Info del sistema'});
        ls.push({t:'o',v:'  <span style="color:#28c840">whoami</span>    Usuario actual'});
        ls.push({t:'o',v:'  <span style="color:#28c840">uname -a</span>  Kernel'});
        ls.push({t:'o',v:'  <span style="color:#28c840">date</span>      Fecha'});
        ls.push({t:'o',v:'  <span style="color:#28c840">clear</span>     Limpiar'});
        break;
      case 'neofetch':
        ls.push({t:'o',v:''});
        ls.push({t:'o',v:'       <span style="color:#DD0031">/\\</span>          <span style="color:#DD0031">archsgo</span>@<span style="color:#1793D1">desktop</span>'});
        ls.push({t:'o',v:'      <span style="color:#DD0031">/  \\</span>         \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500'});
        ls.push({t:'o',v:'     <span style="color:#DD0031">/    \\</span>        <span style="color:#1793D1">OS:</span> ArchsGo Linux 2.0'});
        ls.push({t:'o',v:'    <span style="color:#DD0031">/      \\</span>       <span style="color:#1793D1">Kernel:</span> 6.10.2-archsgo'});
        ls.push({t:'o',v:'   <span style="color:#DD0031">/   /\\   \\</span>      <span style="color:#1793D1">Shell:</span> zsh 5.9'});
        ls.push({t:'o',v:'  <span style="color:#DD0031">/   /  \\   \\</span>     <span style="color:#1793D1">DE:</span> ArchsGo Desktop 2.0'});
        ls.push({t:'o',v:' <span style="color:#DD0031">/   /    \\   \\</span>    <span style="color:#1793D1">CPU:</span> AMD Ryzen 7 7800X3D'});
        ls.push({t:'o',v:'<span style="color:#DD0031">/___/      \\___\\</span>   <span style="color:#1793D1">RAM:</span> 7.5 / 16 GB'});
        ls.push({t:'o',v:''});
        break;
      case 'whoami': ls.push({t:'s',v:'archsgo'}); break;
      case 'uname': ls.push({t:'o',v:'Linux archsgo-desktop 6.10.2-archsgo #1 SMP x86_64 GNU/Linux'}); break;
      case 'date': ls.push({t:'o',v:new Date().toString()}); break;
      case 'clear': this.tLines.set([]); this.tInp=''; return;
      default: ls.push({t:'e',v:`zsh: command not found: ${p}`});
    }
    ls.push({t:'o',v:''});
    this.tLines.set(ls);
    this.tInp = '';
  }

  ctxOpen(e: MouseEvent): void { e.preventDefault(); this.ctx.set({s:true,x:e.clientX,y:e.clientY}); }
  ctxClose(): void { this.ctx.set({s:false,x:0,y:0}); }

  showNtf(t: string, m: string): void {
    this.ntf.set({s:true,t,m});
    setTimeout(() => this.ntf.set({s:false,t:'',m:''}), 5000);
  }
}