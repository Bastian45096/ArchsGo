import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="scanlines"></div>

      <!-- ═══ LEFT PANEL ═══ -->
      <div class="panel-left">
        <div class="grid-bg"></div>

        <div class="branding">
          <div class="icon-stage">
            <div class="glow-r"></div>
            <div class="glow-b"></div>
            <div class="ring-outer"></div>
            <div class="ring-inner"></div>
            <div class="sat s1"></div>
            <div class="sat s2"></div>
            <div class="sat s3"></div>
            <div class="icon-scan"></div>

            <div class="icon-core">
              <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gRed" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#DD0031"/>
                    <stop offset="100%" stop-color="#ff1a4a"/>
                  </linearGradient>
                  <linearGradient id="gBlue" x1="240" y1="0" x2="0" y2="240" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#1793D1"/>
                    <stop offset="100%" stop-color="#38b6f0"/>
                  </linearGradient>
                  <linearGradient id="gFusion" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#DD0031"/>
                    <stop offset="30%" stop-color="#c02070"/>
                    <stop offset="60%" stop-color="#7040b0"/>
                    <stop offset="100%" stop-color="#1793D1"/>
                  </linearGradient>
                  <linearGradient id="gDark" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#1a0010"/>
                    <stop offset="100%" stop-color="#001520"/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <filter id="glowS">
                    <feGaussianBlur stdDeviation="5" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                <path d="M120 16 L210 56 L210 140 Q210 200 120 228 Q30 200 30 140 L30 56 Z"
                      fill="none" stroke="url(#gFusion)" stroke-width="3" opacity="0.9" filter="url(#glow)"/>
                <path d="M120 16 L210 56 L210 140 Q210 200 120 228 Q30 200 30 140 L30 56 Z"
                      fill="url(#gDark)" opacity="0.6"/>
                <path d="M120 30 L198 65 L198 138 Q198 192 120 218 Q42 192 42 138 L42 65 Z"
                      fill="none" stroke="url(#gFusion)" stroke-width="1" opacity="0.2"/>

                <path d="M120 42 L78 170 L92 170 L120 68 L120 42 Z"
                      fill="url(#gRed)" opacity="0.9" filter="url(#glow)"/>
                <path d="M120 42 L162 170 L148 170 L120 68 L120 42 Z"
                      fill="url(#gBlue)" opacity="0.9" filter="url(#glow)"/>
                <path d="M120 42 L115 68 L120 60 L125 68 Z"
                      fill="url(#gFusion)" opacity="0.8"/>

                <path d="M120 80 L100 155 L110 155 L120 100 L130 155 L140 155 Z"
                      fill="url(#gDark)" opacity="0.95"/>
                <path d="M120 80 L100 155 L110 155 L120 100 L130 155 L140 155 Z"
                      fill="none" stroke="url(#gFusion)" stroke-width="0.8" opacity="0.4"/>

                <rect x="96" y="130" width="48" height="4" rx="2" fill="url(#gFusion)" opacity="0.7" filter="url(#glow)"/>

                <path d="M78 172 Q98 195, 120 200 Q142 195, 162 172"
                      stroke="url(#gFusion)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6" filter="url(#glow)"/>

                <circle cx="120" cy="42" r="3" fill="url(#gFusion)" filter="url(#glowS)">
                  <animate attributeName="r" values="3;4;3" dur="3s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite"/>
                </circle>

                <circle cx="82" cy="168" r="2" fill="#DD0031" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite"/>
                </circle>
                <circle cx="158" cy="168" r="2" fill="#1793D1" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" begin="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="120" cy="200" r="2.5" fill="url(#gFusion)" opacity="0.4">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.5s" begin="1s" repeatCount="indefinite"/>
                </circle>

                <path d="M50 62 L50 58 L54 58" stroke="#DD0031" stroke-width="1" fill="none" opacity="0.3"/>
                <path d="M190 62 L190 58 L186 58" stroke="#1793D1" stroke-width="1" fill="none" opacity="0.3"/>
                <path d="M50 140 L50 144 L54 144" stroke="#DD0031" stroke-width="1" fill="none" opacity="0.2"/>
                <path d="M190 140 L190 144 L186 144" stroke="#1793D1" stroke-width="1" fill="none" opacity="0.2"/>

                <line x1="120" y1="42" x2="78" y2="170" stroke="#DD0031" stroke-width="0.5" opacity="0.15"/>
                <line x1="120" y1="42" x2="162" y2="170" stroke="#1793D1" stroke-width="0.5" opacity="0.15"/>

                <path d="M112 55 L120 42 L128 55" stroke="url(#gFusion)" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
              </svg>
            </div>
          </div>

          <div class="brand">
            <h1><span class="t-red">Arch</span><span class="t-blue">sGo</span></h1>
            <p class="tagline">build &bull; deploy &bull; conquer</p>
          </div>
        </div>
      </div>

      <!-- ═══ RIGHT PANEL ═══ -->
      <div class="panel-right">
        <div class="corner tl"></div>
        <div class="corner br"></div>

        <div class="form-head">
          <div class="mini-icon">
            <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gF2" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#DD0031"/>
                  <stop offset="50%" stop-color="#7040b0"/>
                  <stop offset="100%" stop-color="#1793D1"/>
                </linearGradient>
                <linearGradient id="gD2" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#1a0010"/>
                  <stop offset="100%" stop-color="#001520"/>
                </linearGradient>
                <linearGradient id="gR2" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#DD0031"/>
                  <stop offset="100%" stop-color="#ff1a4a"/>
                </linearGradient>
                <linearGradient id="gB2" x1="240" y1="0" x2="0" y2="240" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#1793D1"/>
                  <stop offset="100%" stop-color="#38b6f0"/>
                </linearGradient>
              </defs>
              <path d="M120 16 L210 56 L210 140 Q210 200 120 228 Q30 200 30 140 L30 56 Z"
                    fill="none" stroke="url(#gF2)" stroke-width="4"/>
              <path d="M120 16 L210 56 L210 140 Q210 200 120 228 Q30 200 30 140 L30 56 Z"
                    fill="url(#gD2)" opacity="0.7"/>
              <path d="M120 42 L78 170 L92 170 L120 68 L120 42 Z" fill="url(#gR2)" opacity="0.9"/>
              <path d="M120 42 L162 170 L148 170 L120 68 L120 42 Z" fill="url(#gB2)" opacity="0.9"/>
              <path d="M120 80 L100 155 L110 155 L120 100 L130 155 L140 155 Z" fill="url(#gD2)" opacity="0.95"/>
              <rect x="96" y="130" width="48" height="4" rx="2" fill="url(#gF2)" opacity="0.7"/>
            </svg>
            <span>ArchsGo</span>
          </div>
          <h2>Iniciar Sesi&oacute;n</h2>
          <p>Accede a tu panel de control</p>
          <div class="accent-bar"></div>
        </div>

        <!-- Terminal -->
        <div class="term-bar">
          <div class="term-dot d1"></div>
          <div class="term-dot d2"></div>
          <div class="term-dot d3"></div>
          <span class="term-txt"><b>$</b> archsgo --session <em>--auth</em></span>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onLogin()">

          <div class="fg fg-user">
            <div class="fg-head">
              <span class="pip"></span>
              <span>Usuario</span>
            </div>
            <div class="inp-wrap">
              <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input type="text"
                     [(ngModel)]="username"
                     name="username"
                     placeholder="root&#64;archsgo"
                     autocomplete="username"
                     spellcheck="false">
            </div>
            <div class="inp-line"></div>
          </div>

          <div class="fg fg-pass">
            <div class="fg-head">
              <span class="pip"></span>
              <span>Contrase&ntilde;a</span>
            </div>
            <div class="inp-wrap">
              <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input [type]="showPwd() ? 'text' : 'password'"
                     [(ngModel)]="password"
                     name="password"
                     placeholder="••••••••••"
                     autocomplete="current-password">
              <button type="button" class="eye-btn" (click)="showPwd.set(!showPwd())" tabindex="-1">
                @if (!showPwd()) {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                } @else {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                }
              </button>
            </div>
            <div class="inp-line"></div>
          </div>

          <div class="opts">
            <label class="chk">
              <div class="chk-box">
                <input type="checkbox" [(ngModel)]="remember" name="remember">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span>Mantener sesi&oacute;n</span>
            </label>
            <a href="#" class="forgot">&iquest;Olvidaste tu clave?</a>
          </div>

          <button type="submit" class="submit" [disabled]="loading()">
            <span class="submit-inner">
              @if (!loading()) {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Entrar
              }
              @if (loading()) {
                <span class="spin"></span>
              }
            </span>
          </button>
        </form>

        <div class="divider">
          <div class="divider-line"></div>
          <span class="divider-txt">acceso externo</span>
          <div class="divider-line"></div>
        </div>

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

        <div class="form-foot">
          <p>&iquest;No tienes cuenta? <a routerLink="/create">Crea tu cuenta</a></p>
        </div>

        <span class="ver">v2.0.0-stable</span>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      background: #060608;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    .page {
      font-family: 'Chakra Petch', sans-serif;
      background: #060608;
      color: #dcdce4;
      min-height: 100vh;
      display: flex;
      overflow: hidden;
    }

    .scanlines {
      position: fixed; inset: 0;
      pointer-events: none; z-index: 999;
      background: repeating-linear-gradient(
        0deg, transparent, transparent 2px,
        rgba(0,0,0,0.012) 2px, rgba(0,0,0,0.012) 4px
      );
    }

    /* ═══ LEFT ═══ */
    .panel-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 60px;
      overflow: hidden;
      background: #060608;
    }

    .panel-left::before {
      content: '';
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 600px 600px at 30% 35%, rgba(221,0,49,0.06), transparent 70%),
        radial-gradient(ellipse 500px 500px at 70% 75%, rgba(23,147,209,0.06), transparent 70%);
      pointer-events: none;
    }

    .grid-bg {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
      background-size: 70px 70px;
      mask-image: radial-gradient(ellipse 65% 60% at 50% 50%, black, transparent);
      -webkit-mask-image: radial-gradient(ellipse 65% 60% at 50% 50%, black, transparent);
      pointer-events: none;
      animation: gridPulse 10s ease-in-out infinite alternate;
    }

    @keyframes gridPulse {
      0% { opacity: 0.4; }
      100% { opacity: 1; }
    }

    .branding {
      position: relative; z-index: 2;
      text-align: center;
      animation: brandIn 1s cubic-bezier(0.16,1,0.3,1) forwards;
      opacity: 0;
    }

    @keyframes brandIn {
      from { opacity: 0; transform: translateY(40px) scale(0.92); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .icon-stage {
      position: relative;
      width: 220px; height: 220px;
      margin: 0 auto 36px;
    }

    .glow-r {
      position: absolute; inset: -40px; border-radius: 50%;
      background: radial-gradient(circle at 35% 40%, rgba(221,0,49,0.12), transparent 60%);
      filter: blur(30px);
      animation: gPulse 6s ease-in-out infinite alternate;
    }

    .glow-b {
      position: absolute; inset: -40px; border-radius: 50%;
      background: radial-gradient(circle at 65% 60%, rgba(23,147,209,0.12), transparent 60%);
      filter: blur(30px);
      animation: gPulse 6s ease-in-out infinite alternate;
      animation-delay: -3s;
    }

    @keyframes gPulse {
      0% { opacity: 0.4; transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1.1); }
    }

    .ring-outer {
      position: absolute; inset: 0;
      border: 2px solid transparent;
      border-top-color: #DD0031;
      border-right-color: rgba(221,0,49,0.15);
      border-bottom-color: #1793D1;
      border-left-color: rgba(23,147,209,0.15);
      border-radius: 50%;
      animation: spinR 16s linear infinite;
    }

    .ring-inner {
      position: absolute; inset: 14px;
      border: 1px dashed rgba(255,255,255,0.04);
      border-radius: 50%;
      animation: spinR 12s linear infinite reverse;
    }

    @keyframes spinR { to { transform: rotate(360deg); } }

    .sat {
      position: absolute; top: 50%; left: 50%;
      border-radius: 50%;
    }

    .sat.s1 {
      width: 7px; height: 7px;
      background: #DD0031;
      box-shadow: 0 0 12px #DD0031, 0 0 4px #DD0031;
      animation: orb1 8s linear infinite;
    }

    .sat.s2 {
      width: 5px; height: 5px;
      background: #1793D1;
      box-shadow: 0 0 12px #1793D1, 0 0 4px #1793D1;
      animation: orb1 8s linear infinite reverse;
      animation-delay: -4s;
    }

    .sat.s3 {
      width: 4px; height: 4px;
      background: #a040b0;
      box-shadow: 0 0 8px #a040b0;
      animation: orb2 12s linear infinite;
    }

    @keyframes orb1 {
      from { transform: rotate(0deg) translateX(108px) rotate(0deg); }
      to { transform: rotate(360deg) translateX(108px) rotate(-360deg); }
    }

    @keyframes orb2 {
      from { transform: rotate(0deg) translateX(90px) rotate(0deg); }
      to { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
    }

    .icon-core {
      position: absolute; inset: 30px; z-index: 5;
      display: flex; align-items: center; justify-content: center;
    }

    .icon-core svg {
      width: 100%; height: 100%;
      filter:
        drop-shadow(0 0 20px rgba(221,0,49,0.18))
        drop-shadow(0 0 20px rgba(23,147,209,0.12));
      animation: iconBreath 5s ease-in-out infinite alternate;
    }

    @keyframes iconBreath {
      0% { filter: drop-shadow(0 0 15px rgba(221,0,49,0.12)) drop-shadow(0 0 15px rgba(23,147,209,0.08)); }
      100% { filter: drop-shadow(0 0 30px rgba(221,0,49,0.25)) drop-shadow(0 0 30px rgba(23,147,209,0.2)); }
    }

    .icon-scan {
      position: absolute; inset: 30px; z-index: 6;
      overflow: hidden; border-radius: 50%;
      pointer-events: none;
    }

    .icon-scan::before {
      content: '';
      position: absolute; left: 0; width: 100%; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(221,0,49,0.4), rgba(23,147,209,0.4), transparent);
      animation: scanD 4s ease-in-out infinite;
    }

    @keyframes scanD {
      0%, 100% { top: 5%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      50% { top: 90%; }
    }

    .brand h1 {
      font-size: 44px;
      font-weight: 700;
      letter-spacing: 6px;
      text-transform: uppercase;
      line-height: 1;
      margin-bottom: 8px;
    }

    .brand h1 .t-red {
      background: linear-gradient(135deg, #DD0031, #ff1a4a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand h1 .t-blue {
      background: linear-gradient(135deg, #1793D1, #38b6f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand .tagline {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 5px;
      text-transform: uppercase;
      color: #555568;
    }

    /* ═══ RIGHT ═══ */
    .panel-right {
      width: 480px;
      min-height: 100vh;
      background: #0d0d18;
      border-left: 1px solid rgba(255,255,255,0.08);
      box-shadow:
        -8px 0 40px rgba(0,0,0,0.5),
        -2px 0 0 rgba(221,0,49,0.08),
        2px 0 0 rgba(23,147,209,0.08);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 56px 48px;
      position: relative;
      overflow: hidden;
    }

    .panel-right::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 2px; height: 100%;
      background: linear-gradient(to bottom, #DD0031, transparent 30%, transparent 70%, #1793D1);
      opacity: 0.7;
    }

    .panel-right::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, #DD0031, rgba(160,64,176,0.3), #1793D1);
      opacity: 0.4;
    }

    .corner { position: absolute; width: 36px; height: 36px; pointer-events: none; }

    .corner.tl {
      top: 18px; left: 18px;
      border-top: 1.5px solid #DD0031;
      border-left: 1.5px solid #DD0031;
      opacity: 0.3;
    }

    .corner.br {
      bottom: 18px; right: 18px;
      border-bottom: 1.5px solid #1793D1;
      border-right: 1.5px solid #1793D1;
      opacity: 0.3;
    }

    .form-head {
      margin-bottom: 36px;
      opacity: 0;
      animation: slideR 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s forwards;
    }

    @keyframes slideR {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .form-head .mini-icon {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 18px;
    }

    .form-head .mini-icon svg {
      width: 28px; height: 28px;
      filter: drop-shadow(0 0 8px rgba(221,0,49,0.2)) drop-shadow(0 0 8px rgba(23,147,209,0.15));
    }

    .form-head .mini-icon span {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #555568;
    }

    .form-head h2 {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 6px;
      color: #e8e8f0;
    }

    .form-head p {
      font-size: 13px;
      color: #555568;
      letter-spacing: 0.3px;
    }

    .form-head .accent-bar {
      width: 44px; height: 2px;
      background: linear-gradient(90deg, #DD0031, #1793D1);
      margin-top: 16px;
      border-radius: 1px;
    }

    .term-bar {
      display: flex; align-items: center; gap: 7px;
      padding: 10px 14px;
      margin-bottom: 28px;
      background: rgba(0,0,0,0.4);
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.05);
      opacity: 0;
      animation: slideR 0.5s ease 0.2s forwards;
    }

    .term-dot { width: 8px; height: 8px; border-radius: 50%; }
    .term-dot.d1 { background: #ff5f57; }
    .term-dot.d2 { background: #febc2e; }
    .term-dot.d3 { background: #28c840; }

    .term-txt {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; color: #2a2a38;
      margin-left: 6px;
    }

    .term-txt b { color: #DD0031; font-weight: 400; }
    .term-txt em { color: #1793D1; font-style: normal; }

    .fg {
      margin-bottom: 22px;
      opacity: 0;
      animation: slideR 0.5s ease forwards;
    }

    .fg-user { animation-delay: 0.4s; }
    .fg-pass { animation-delay: 0.5s; }

    .fg-head {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 9px;
    }

    .fg-head .pip {
      width: 5px; height: 5px;
      border-radius: 1px;
      transform: rotate(45deg);
    }

    .fg-user .pip { background: #DD0031; }
    .fg-pass .pip { background: #1793D1; }

    .fg-head span {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #555568;
    }

    .fg-head::after {
      content: ''; flex: 1; height: 1px;
      background: rgba(255,255,255,0.05);
      margin-left: 8px;
    }

    .inp-wrap { position: relative; }

    .inp-wrap .ico {
      position: absolute; left: 14px; top: 50%;
      transform: translateY(-50%);
      width: 16px; height: 16px;
      color: #2a2a38;
      transition: color 0.35s;
      pointer-events: none;
    }

    .inp-wrap input {
      width: 100%;
      padding: 15px 16px 15px 44px;
      background: #10101c;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      color: #dcdce4;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      outline: none;
      transition: all 0.35s ease;
      letter-spacing: 0.5px;
    }

    .inp-wrap input::placeholder {
      color: #2a2a38;
      font-size: 12px;
      letter-spacing: 1px;
    }

    .inp-wrap input:focus {
      background: #141422;
      border-color: #DD0031;
      box-shadow: 0 0 0 3px rgba(221,0,49,0.08), 0 0 25px rgba(221,0,49,0.04);
    }

    .fg-pass .inp-wrap input:focus {
      border-color: #1793D1;
      box-shadow: 0 0 0 3px rgba(23,147,209,0.08), 0 0 25px rgba(23,147,209,0.04);
    }

    .inp-wrap:focus-within .ico { color: #DD0031; }
    .fg-pass .inp-wrap:focus-within .ico { color: #1793D1; }

    .inp-line {
      height: 2px; margin-top: 3px;
      border-radius: 1px;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
    }

    .fg-user .inp-line {
      background: linear-gradient(90deg, #DD0031, transparent);
    }

    .fg-pass .inp-line {
      background: linear-gradient(90deg, #1793D1, transparent);
    }

    .inp-wrap:focus-within ~ .inp-line { transform: scaleX(1); }

    .eye-btn {
      position: absolute; right: 12px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none;
      color: #2a2a38; cursor: pointer;
      padding: 4px; display: flex;
      transition: color 0.3s;
    }

    .eye-btn:hover { color: #555568; }

    .opts {
      display: flex; align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
      opacity: 0;
      animation: slideR 0.5s ease 0.6s forwards;
    }

    .chk {
      display: flex; align-items: center; gap: 9px;
      cursor: pointer; user-select: none;
      font-size: 12px; color: #555568;
    }

    .chk-box {
      width: 16px; height: 16px;
      border: 1.5px solid rgba(255,255,255,0.1);
      border-radius: 4px;
      position: relative;
      background: #10101c;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.3s;
    }

    .chk-box input {
      position: absolute; inset: 0;
      opacity: 0; cursor: pointer;
      width: 100%; height: 100%;
      padding: 0; border: none;
    }

    .chk-box svg {
      width: 10px; height: 10px;
      opacity: 0; transform: scale(0);
      transition: all 0.2s;
      color: #060608;
    }

    .chk-box input:checked ~ svg { opacity: 1; transform: scale(1); }

    .chk-box:has(input:checked) {
      background: linear-gradient(135deg, #DD0031, #1793D1);
      border-color: transparent;
    }

    .forgot {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #DD0031;
      text-decoration: none;
      position: relative;
      transition: color 0.3s;
    }

    .forgot::after {
      content: '';
      position: absolute; bottom: -2px; left: 0;
      width: 0; height: 1px;
      background: #DD0031;
      transition: width 0.3s;
    }

    .forgot:hover { color: #ff1a4a; }
    .forgot:hover::after { width: 100%; }

    .submit {
      width: 100%; padding: 16px;
      border: none; border-radius: 8px;
      font-family: 'Chakra Petch', sans-serif;
      font-size: 14px; font-weight: 700;
      letter-spacing: 5px;
      text-transform: uppercase;
      color: #fff; cursor: pointer;
      position: relative; overflow: hidden;
      background: linear-gradient(135deg, #DD0031 0%, #a040b0 50%, #1793D1 100%);
      background-size: 250% 250%;
      animation: gradM 6s ease infinite, slideR 0.5s ease 0.7s forwards;
      opacity: 0;
      transition: transform 0.2s, box-shadow 0.3s;
    }

    @keyframes gradM {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .submit:hover {
      transform: translateY(-2px);
      box-shadow:
        0 8px 30px rgba(221,0,49,0.25),
        0 8px 30px rgba(23,147,209,0.15);
    }

    .submit:active { transform: translateY(0) scale(0.98); }
    .submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    .submit::after {
      content: '';
      position: absolute;
      top: -50%; left: -70%;
      width: 50%; height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
      transform: skewX(-25deg);
      transition: left 0.7s ease;
    }

    .submit:hover::after { left: 130%; }

    .submit-inner {
      position: relative; z-index: 2;
      display: flex; align-items: center;
      justify-content: center; gap: 10px;
    }

    .spin {
      display: inline-block;
      width: 18px; height: 18px;
      border: 2px solid rgba(255,255,255,0.2);
      border-top-color: #fff;
      border-radius: 50%;
      animation: rot 0.6s linear infinite;
    }

    @keyframes rot { to { transform: rotate(360deg); } }

    .divider {
      display: flex; align-items: center; gap: 14px;
      margin: 26px 0;
      opacity: 0;
      animation: slideR 0.5s ease 0.8s forwards;
    }

    .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.05); }

    .divider-txt {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px; letter-spacing: 3px;
      text-transform: uppercase;
      color: #2a2a38;
    }

    .socials {
      display: flex; gap: 10px;
      opacity: 0;
      animation: slideR 0.5s ease 0.9s forwards;
    }

    .soc {
      flex: 1; padding: 12px;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      background: #10101c;
      color: #555568; cursor: pointer;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; letter-spacing: 0.5px;
      display: flex; align-items: center;
      justify-content: center; gap: 7px;
      transition: all 0.3s;
    }

    .soc:hover {
      border-color: rgba(255,255,255,0.1);
      color: #dcdce4;
      transform: translateY(-1px);
    }

    .soc svg { width: 15px; height: 15px; }

    .form-foot {
      text-align: center;
      margin-top: 30px;
      opacity: 0;
      animation: slideR 0.5s ease 1s forwards;
    }

    .form-foot p { font-size: 13px; color: #555568; }

    .form-foot a {
      color: #1793D1;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s;
    }

    .form-foot a:hover { color: #38b6f0; }

    .ver {
      position: absolute;
      bottom: 16px; right: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px; letter-spacing: 2px;
      color: #2a2a38;
      text-transform: uppercase;
      opacity: 0;
      animation: slideR 0.5s ease 1.1s forwards;
    }

    @media (max-width: 960px) {
      .page { flex-direction: column; }
      .panel-left {
        min-height: 45vh;
        padding: 40px 30px;
      }
      .panel-right {
        width: 100%;
        min-height: 55vh;
        padding: 40px 30px;
      }
      .brand h1 { font-size: 32px; letter-spacing: 4px; }
      .icon-stage { width: 170px; height: 170px; }
    }

    @media (max-width: 480px) {
      .panel-left { padding: 30px 20px; min-height: 38vh; }
      .panel-right { padding: 30px 20px; }
      .brand h1 { font-size: 26px; letter-spacing: 3px; }
      .icon-stage { width: 140px; height: 140px; }
      .form-head h2 { font-size: 22px; }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  remember = false;
  showPwd = signal(false);
  loading = signal(false);

  onLogin(): void {
    if (this.loading()) return;
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      console.log('Login:', { user: this.username, remember: this.remember });
    }, 2000);
  }
}