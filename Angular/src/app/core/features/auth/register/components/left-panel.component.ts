import { Component } from '@angular/core';

@Component({
  selector: 'app-register-left-panel',
  standalone: true,
  template: `
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
  `,
  styles: [`
    :host {
      display:flex; flex:1; flex-direction:column;
      align-items:center; justify-content:center;
      position:relative; padding:60px;
      overflow:hidden; background:#060608;
    }
    .grid-bg { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px); background-size:70px 70px; mask-image:radial-gradient(ellipse 65% 60% at 50% 50%,black,transparent); -webkit-mask-image:radial-gradient(ellipse 65% 60% at 50% 50%,black,transparent); pointer-events:none; animation:gridPulse 10s ease-in-out infinite alternate; }
    @keyframes gridPulse { 0%{opacity:0.4} 100%{opacity:1} }
    .branding {
      position:relative; z-index:2; text-align:center;
      animation:brandIn 1s cubic-bezier(0.16,1,0.3,1) forwards;
      opacity:0;
    }
    @keyframes brandIn { from{opacity:0;transform:translateY(40px) scale(0.92)} to{opacity:1;transform:translateY(0) scale(1)} }
    .icon-stage { position:relative; width:220px; height:220px; margin:0 auto 36px; }
    .glow-r { position:absolute; inset:-40px; border-radius:50%; background:radial-gradient(circle at 35% 40%,rgba(221,0,49,0.12),transparent 60%); filter:blur(30px); animation:gPulse 6s ease-in-out infinite alternate; }
    .glow-b { position:absolute; inset:-40px; border-radius:50%; background:radial-gradient(circle at 65% 60%,rgba(23,147,209,0.12),transparent 60%); filter:blur(30px); animation:gPulse 6s ease-in-out infinite alternate; animation-delay:-3s; }
    @keyframes gPulse { 0%{opacity:0.4;transform:scale(0.9)} 100%{opacity:1;transform:scale(1.1)} }
    .ring-outer { position:absolute; inset:0; border:2px solid transparent; border-top-color:#DD0031; border-right-color:rgba(221,0,49,0.15); border-bottom-color:#1793D1; border-left-color:rgba(23,147,209,0.15); border-radius:50%; animation:spinR 16s linear infinite; }
    .ring-inner { position:absolute; inset:14px; border:1px dashed rgba(255,255,255,0.04); border-radius:50%; animation:spinR 12s linear infinite reverse; }
    @keyframes spinR { to{transform:rotate(360deg)} }
    .sat { position:absolute; top:50%; left:50%; border-radius:50%; }
    .sat.s1 { width:7px; height:7px; background:#DD0031; box-shadow:0 0 12px #DD0031,0 0 4px #DD0031; animation:orb1 8s linear infinite; }
    .sat.s2 { width:5px; height:5px; background:#1793D1; box-shadow:0 0 12px #1793D1,0 0 4px #1793D1; animation:orb1 8s linear infinite reverse; animation-delay:-4s; }
    .sat.s3 { width:4px; height:4px; background:#a040b0; box-shadow:0 0 8px #a040b0; animation:orb2 12s linear infinite; }
    @keyframes orb1 { from{transform:rotate(0deg) translateX(108px) rotate(0deg)} to{transform:rotate(360deg) translateX(108px) rotate(-360deg)} }
    @keyframes orb2 { from{transform:rotate(0deg) translateX(90px) rotate(0deg)} to{transform:rotate(360deg) translateX(90px) rotate(-360deg)} }
    .icon-core { position:absolute; inset:30px; z-index:5; display:flex; align-items:center; justify-content:center; }
    .icon-core svg { width:100%; height:100%; filter:drop-shadow(0 0 20px rgba(221,0,49,0.18)) drop-shadow(0 0 20px rgba(23,147,209,0.12)); animation:iconBreath 5s ease-in-out infinite alternate; }
    @keyframes iconBreath { 0%{filter:drop-shadow(0 0 15px rgba(221,0,49,0.12)) drop-shadow(0 0 15px rgba(23,147,209,0.08))} 100%{filter:drop-shadow(0 0 30px rgba(221,0,49,0.25)) drop-shadow(0 0 30px rgba(23,147,209,0.2))} }
    .icon-scan { position:absolute; inset:30px; z-index:6; overflow:hidden; border-radius:50%; pointer-events:none; }
    .icon-scan::before { content:''; position:absolute; left:0; width:100%; height:2px; background:linear-gradient(90deg,transparent,rgba(221,0,49,0.4),rgba(23,147,209,0.4),transparent); animation:scanD 4s ease-in-out infinite; }
    @keyframes scanD { 0%,100%{top:5%;opacity:0} 10%{opacity:1} 90%{opacity:1} 50%{top:90%} }
    .brand h1 { font-family:'Chakra Petch',sans-serif; font-size:44px; font-weight:700; letter-spacing:6px; text-transform:uppercase; line-height:1; margin-bottom:8px; }
    .brand h1 .t-red { background:linear-gradient(135deg,#DD0031,#ff1a4a); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .brand h1 .t-blue { background:linear-gradient(135deg,#1793D1,#38b6f0); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .brand .tagline { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:5px; text-transform:uppercase; color:#555568; }
  `]
})
export class LeftPanelComponent {}