import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-register',
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
          <h2>Crear Cuenta</h2>
          <p>Reg&iacute;strate para empezar a construir</p>
          <div class="accent-bar"></div>
        </div>

        <!-- Terminal -->
        <div class="term-bar">
          <div class="term-dot d1"></div>
          <div class="term-dot d2"></div>
          <div class="term-dot d3"></div>
          <span class="term-txt"><b>$</b> archsgo --register <em>--new-user</em></span>
        </div>

        <!-- Form -->
                <!-- Form -->
        <form (ngSubmit)="onRegister()">

          <!-- Username -->
          <div class="fg fg-user">
            <div class="fg-head">
              <span class="pip"></span>
              <span>Username</span>
            </div>
            <div class="inp-wrap">
              <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input type="text"
                     [(ngModel)]="username"
                     name="username"
                     placeholder="tu_username"
                     autocomplete="username"
                     spellcheck="false">
            </div>
            <div class="inp-line"></div>
            @if (errUsername()) {
              <div class="field-err">{{ errUsername() }}</div>
            }
          </div>

          <!-- Email -->
          <div class="fg fg-email">
            <div class="fg-head">
              <span class="pip"></span>
              <span>Email</span>
            </div>
            <div class="inp-wrap">
              <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 4L12 13 2 4"/>
              </svg>
              <input type="email"
                     [(ngModel)]="email"
                     name="email"
                     placeholder="tu&#64;correo.com"
                     autocomplete="email"
                     spellcheck="false">
            </div>
            <div class="inp-line"></div>
            @if (errEmail()) {
              <div class="field-err">{{ errEmail() }}</div>
            }
          </div>

          <!-- Password -->
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
                     placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                     autocomplete="new-password">
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

            <!-- PASSWORD RULES -->
            <div class="rules" [class.visible]="password.length > 0">
              <div class="rule" [class.pass]="ruleLength">
                <div class="rule-icon">
                  @if (ruleLength) {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  } @else {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/></svg>
                  }
                </div>
                <span>M&iacute;nimo 8 caracteres</span>
                <div class="rule-bar">
                  <div class="rule-fill" [style.width.%]="lengthProgress"></div>
                </div>
              </div>

              <div class="rule" [class.pass]="ruleUppercase">
                <div class="rule-icon">
                  @if (ruleUppercase) {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  } @else {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/></svg>
                  }
                </div>
                <span>Al menos 1 may&uacute;scula</span>
                <div class="rule-bar">
                  <div class="rule-fill" [style.width.%]="ruleUppercase ? 100 : 0"></div>
                </div>
              </div>

              <div class="rule" [class.pass]="ruleNumbers">
                <div class="rule-icon">
                  @if (ruleNumbers) {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  } @else {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/></svg>
                  }
                </div>
                <span>Al menos 2 n&uacute;meros</span>
                <div class="rule-bar">
                  <div class="rule-fill" [style.width.%]="numbersProgress"></div>
                </div>
              </div>

              <div class="rule" [class.pass]="ruleSpecial">
                <div class="rule-icon">
                  @if (ruleSpecial) {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  } @else {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/></svg>
                  }
                </div>
                <span>1 car&aacute;cter especial (!&#64;#$...)</span>
                <div class="rule-bar">
                  <div class="rule-fill" [style.width.%]="ruleSpecial ? 100 : 0"></div>
                </div>
              </div>

              <!-- Strength meter -->
              <div class="strength">
                <div class="str-label">Fortaleza:</div>
                <div class="str-bars">
                  <div class="str-bar" [class.active]="strength >= 1" [class.weak]="strength === 1" [class.mid]="strength >= 2" [class.strong]="strength >= 4"></div>
                  <div class="str-bar" [class.active]="strength >= 2" [class.mid]="strength >= 2" [class.strong]="strength >= 4"></div>
                  <div class="str-bar" [class.active]="strength >= 3" [class.mid]="strength === 3" [class.strong]="strength >= 4"></div>
                  <div class="str-bar" [class.active]="strength >= 4" [class.strong]="strength >= 4"></div>
                </div>
                <span class="str-text" [class.weak]="strength === 1" [class.mid]="strength === 2 || strength === 3" [class.strong]="strength >= 4">
                  {{ strengthLabel }}
                </span>
              </div>
            </div>
            @if (errPassword()) {
              <div class="field-err">{{ errPassword() }}</div>
            }
          </div>

          <!-- Confirm Password -->
          <div class="fg fg-confirm">
            <div class="fg-head">
              <span class="pip"></span>
              <span>Confirmar contrase&ntilde;a</span>
            </div>
            <div class="inp-wrap">
              <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <input [type]="showConfirm() ? 'text' : 'password'"
                     [(ngModel)]="confirmPassword"
                     name="confirmPassword"
                     placeholder="Repite tu contrase&ntilde;a"
                     autocomplete="new-password">
              <button type="button" class="eye-btn" (click)="showConfirm.set(!showConfirm())" tabindex="-1">
                @if (!showConfirm()) {
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
            @if (confirmPassword.length > 0 && !passwordsMatch()) {
              <div class="mismatch">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Las contrase&ntilde;as no coinciden
              </div>
            }
            @if (confirmPassword.length > 0 && passwordsMatch()) {
              <div class="match">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Las contrase&ntilde;as coinciden
              </div>
            }
            @if (errConfirm()) {
              <div class="field-err">{{ errConfirm() }}</div>
            }
          </div>

          <!-- Terms -->
          <div class="opts">
            <label class="chk">
              <div class="chk-box">
                <input type="checkbox" [(ngModel)]="acceptTerms" name="acceptTerms">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span>Acepto los <a href="#" class="terms-link">t&eacute;rminos y condiciones</a></span>
            </label>
          </div>

          <button type="submit" class="submit" [disabled]="loading() || !canSubmit()">
            <span class="submit-inner">
              @if (!loading()) {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                Crear Cuenta
              }
              @if (loading()) {
                <span class="spin"></span>
              }
            </span>
          </button>
          @if (errGeneral()) {
            <div class="field-err field-err-general">{{ errGeneral() }}</div>
          }
        </form>

        <div class="divider">
          <div class="divider-line"></div>
          <span class="divider-txt">o reg&iacute;strate con</span>
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
          <p>&iquest;Ya tienes cuenta? <a routerLink="/login">Iniciar sesi&oacute;n</a></p>
        </div>

        <span class="ver">v2.0.0-stable</span>
      </div>
    </div>

    <!-- ═══ MODAL OVERLAY ═══ -->
    @if (showModal()) {
      <div class="modal-overlay">
        <div class="modal-box">
          <!-- Logo diferente al del login -->
          <div class="modal-icon">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="mG" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#28c840"/>
                  <stop offset="100%" stop-color="#1793D1"/>
                </linearGradient>
                <filter id="mGlow">
                  <feGaussianBlur stdDeviation="4" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <circle cx="40" cy="40" r="34" fill="#0a0a14" stroke="url(#mG)" stroke-width="2.5" filter="url(#mGlow)"/>
              <circle cx="40" cy="40" r="26" fill="none" stroke="url(#mG)" stroke-width="0.8" opacity="0.2"/>
              <path d="M24 40 L35 51 L56 30" stroke="#28c840" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#mGlow)"/>
              <circle cx="40" cy="40" r="34" fill="none" stroke="url(#mG)" stroke-width="1" opacity="0.1">
                <animate attributeName="r" values="34;37;34" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>

          <h3 class="modal-title">Creando tu cuenta</h3>
          <p class="modal-sub">Esto tomar&aacute; unos segundos...</p>

          <!-- Terminal style status -->
          <div class="modal-term">
            <div class="mt-line" [class.done]="modalStep() >= 1">
              <span class="mt-pip"></span>
              <span class="mt-txt">Validando datos...</span>
            </div>
            <div class="mt-line" [class.done]="modalStep() >= 2">
              <span class="mt-pip"></span>
              <span class="mt-txt">Encriptando contrase&ntilde;a...</span>
            </div>
            <div class="mt-line" [class.done]="modalStep() >= 3">
              <span class="mt-pip"></span>
              <span class="mt-txt">Guardando en base de datos...</span>
            </div>
            <div class="mt-line" [class.done]="modalStep() >= 4">
              <span class="mt-pip"></span>
              <span class="mt-txt">Cuenta creada exitosamente</span>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="modal-bar-wrap">
            <div class="modal-bar" [style.width.%]="modalProgress()"></div>
          </div>
          <span class="modal-pct">{{ modalProgress() }}%</span>
        </div>
      </div>
    }
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

    :host { display:block; width:100%; min-height:100vh; background:#060608; }
    * { margin:0; padding:0; box-sizing:border-box; }

    .page { font-family:'Chakra Petch',sans-serif; background:#060608; color:#dcdce4; height:100vh; display:flex; overflow:hidden; }

    .scanlines { position:fixed; inset:0; pointer-events:none; z-index:999; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.012) 2px,rgba(0,0,0,0.012) 4px); }

    /* ═══ LEFT ═══ */
    .panel-left { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; padding:60px; overflow:hidden; background:#060608; }
    .panel-left::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 600px 600px at 30% 35%,rgba(221,0,49,0.06),transparent 70%),radial-gradient(ellipse 500px 500px at 70% 75%,rgba(23,147,209,0.06),transparent 70%); pointer-events:none; }
    .grid-bg { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px); background-size:70px 70px; mask-image:radial-gradient(ellipse 65% 60% at 50% 50%,black,transparent); -webkit-mask-image:radial-gradient(ellipse 65% 60% at 50% 50%,black,transparent); pointer-events:none; animation:gridPulse 10s ease-in-out infinite alternate; }
    @keyframes gridPulse { 0%{opacity:0.4} 100%{opacity:1} }
    .branding { position:relative; z-index:2; text-align:center; animation:brandIn 1s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }
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
    .brand h1 { font-size:44px; font-weight:700; letter-spacing:6px; text-transform:uppercase; line-height:1; margin-bottom:8px; }
    .brand h1 .t-red { background:linear-gradient(135deg,#DD0031,#ff1a4a); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .brand h1 .t-blue { background:linear-gradient(135deg,#1793D1,#38b6f0); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .brand .tagline { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:5px; text-transform:uppercase; color:#555568; }

    /* ═══ RIGHT ═══ */
    .panel-right { width:500px; min-height:100vh; background:#0d0d18; border-left:1px solid rgba(255,255,255,0.08); box-shadow:-8px 0 40px rgba(0,0,0,0.5),-2px 0 0 rgba(221,0,49,0.08),2px 0 0 rgba(23,147,209,0.08); display:flex; flex-direction:column; justify-content:center; padding:48px 44px; position:relative; overflow-y:auto; }
    .panel-right::before { content:''; position:absolute; top:0; left:0; width:2px; height:100%; background:linear-gradient(to bottom,#DD0031,transparent 30%,transparent 70%,#1793D1); opacity:0.7; }
    .panel-right::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,#DD0031,rgba(160,64,176,0.3),#1793D1); opacity:0.4; }
    .corner { position:absolute; width:36px; height:36px; pointer-events:none; }
    .corner.tl { top:18px; left:18px; border-top:1.5px solid #DD0031; border-left:1.5px solid #DD0031; opacity:0.3; }
    .corner.br { bottom:18px; right:18px; border-bottom:1.5px solid #1793D1; border-right:1.5px solid #1793D1; opacity:0.3; }
    .form-head { margin-bottom:28px; opacity:0; animation:slideR 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s forwards; }
    @keyframes slideR { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
    .form-head .mini-icon { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
    .form-head .mini-icon svg { width:28px; height:28px; filter:drop-shadow(0 0 8px rgba(221,0,49,0.2)) drop-shadow(0 0 8px rgba(23,147,209,0.15)); }
    .form-head .mini-icon span { font-size:14px; font-weight:600; letter-spacing:3px; text-transform:uppercase; color:#555568; }
    .form-head h2 { font-size:26px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; color:#e8e8f0; }
    .form-head p { font-size:13px; color:#555568; letter-spacing:0.3px; }
    .form-head .accent-bar { width:44px; height:2px; background:linear-gradient(90deg,#DD0031,#1793D1); margin-top:14px; border-radius:1px; }
    .term-bar { display:flex; align-items:center; gap:7px; padding:10px 14px; margin-bottom:22px; background:rgba(0,0,0,0.4); border-radius:8px; border:1px solid rgba(255,255,255,0.05); opacity:0; animation:slideR 0.5s ease 0.2s forwards; }
    .term-dot { width:8px; height:8px; border-radius:50%; }
    .term-dot.d1 { background:#ff5f57; }
    .term-dot.d2 { background:#febc2e; }
    .term-dot.d3 { background:#28c840; }
    .term-txt { font-family:'JetBrains Mono',monospace; font-size:11px; color:#2a2a38; margin-left:6px; }
    .term-txt b { color:#DD0031; font-weight:400; }
    .term-txt em { color:#1793D1; font-style:normal; }

    /* ═══ FIELDS ═══ */
    .fg { margin-bottom:18px; opacity:0; animation:slideR 0.5s ease forwards; }
    .fg-user { animation-delay:0.3s; }
    .fg-email { animation-delay:0.4s; }
    .fg-pass { animation-delay:0.5s; }
    .fg-confirm { animation-delay:0.6s; }
    .fg-head { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
    .fg-head .pip { width:5px; height:5px; border-radius:1px; transform:rotate(45deg); }
    .fg-user .pip { background:#DD0031; }
    .fg-email .pip { background:#a040b0; }
    .fg-pass .pip { background:#1793D1; }
    .fg-confirm .pip { background:#28c840; }
    .fg-head span { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:#555568; }
    .fg-head::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.05); margin-left:8px; }
    .inp-wrap { position:relative; }
    .inp-wrap .ico { position:absolute; left:14px; top:50%; transform:translateY(-50%); width:16px; height:16px; color:#2a2a38; transition:color 0.35s; pointer-events:none; }
    .inp-wrap input { width:100%; padding:13px 16px 13px 44px; background:#10101c; border:1px solid rgba(255,255,255,0.06); border-radius:8px; color:#dcdce4; font-family:'JetBrains Mono',monospace; font-size:13px; outline:none; transition:all 0.35s ease; letter-spacing:0.5px; }
    .inp-wrap input::placeholder { color:#2a2a38; font-size:12px; letter-spacing:1px; }
    .inp-wrap input:focus { background:#141422; border-color:#DD0031; box-shadow:0 0 0 3px rgba(221,0,49,0.08),0 0 25px rgba(221,0,49,0.04); }
    .fg-email .inp-wrap input:focus { border-color:#a040b0; box-shadow:0 0 0 3px rgba(160,64,176,0.08),0 0 25px rgba(160,64,176,0.04); }
    .fg-pass .inp-wrap input:focus { border-color:#1793D1; box-shadow:0 0 0 3px rgba(23,147,209,0.08),0 0 25px rgba(23,147,209,0.04); }
    .fg-confirm .inp-wrap input:focus { border-color:#28c840; box-shadow:0 0 0 3px rgba(40,200,64,0.08),0 0 25px rgba(40,200,64,0.04); }
    .inp-wrap:focus-within .ico { color:#DD0031; }
    .fg-email .inp-wrap:focus-within .ico { color:#a040b0; }
    .fg-pass .inp-wrap:focus-within .ico { color:#1793D1; }
    .fg-confirm .inp-wrap:focus-within .ico { color:#28c840; }
    .inp-line { height:2px; margin-top:3px; border-radius:1px; transform:scaleX(0); transform-origin:left; transition:transform 0.4s cubic-bezier(0.16,1,0.3,1); }
    .fg-user .inp-line { background:linear-gradient(90deg,#DD0031,transparent); }
    .fg-email .inp-line { background:linear-gradient(90deg,#a040b0,transparent); }
    .fg-pass .inp-line { background:linear-gradient(90deg,#1793D1,transparent); }
    .fg-confirm .inp-line { background:linear-gradient(90deg,#28c840,transparent); }
    .inp-wrap:focus-within ~ .inp-line { transform:scaleX(1); }
    .eye-btn { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:#2a2a38; cursor:pointer; padding:4px; display:flex; transition:color 0.3s; }
    .eye-btn:hover { color:#555568; }

    /* ═══ PASSWORD RULES ═══ */
    .rules { margin-top:12px; padding:14px; background:rgba(0,0,0,0.25); border-radius:8px; border:1px solid rgba(255,255,255,0.03); max-height:0; overflow:hidden; opacity:0; transition:max-height 0.5s cubic-bezier(0.16,1,0.3,1),opacity 0.4s ease,margin-top 0.4s ease,padding 0.4s ease; margin-top:0; padding:0 14px; }
    .rules.visible { max-height:300px; opacity:1; margin-top:12px; padding:14px; }
    .rule { display:flex; align-items:center; gap:8px; margin-bottom:8px; transition:all 0.3s ease; }
    .rule:last-of-type { margin-bottom:0; }
    .rule-icon { width:16px; height:16px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .rule-icon svg { width:14px; height:14px; color:#2a2a38; transition:all 0.3s ease; }
    .rule.pass .rule-icon svg { color:#28c840; filter:drop-shadow(0 0 4px rgba(40,200,64,0.4)); }
    .rule span { font-family:'JetBrains Mono',monospace; font-size:11px; color:#3a3a48; flex:1; transition:color 0.3s ease; }
    .rule.pass span { color:#7a7a88; }
    .rule-bar { width:40px; height:3px; background:rgba(255,255,255,0.04); border-radius:2px; overflow:hidden; flex-shrink:0; }
    .rule-fill { height:100%; border-radius:2px; background:#2a2a38; transition:width 0.4s cubic-bezier(0.16,1,0.3,1),background 0.3s ease; width:0%; }
    .rule.pass .rule-fill { background:#28c840; box-shadow:0 0 6px rgba(40,200,64,0.3); }
    .strength { display:flex; align-items:center; gap:10px; margin-top:12px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.03); }
    .str-label { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:#2a2a38; }
    .str-bars { display:flex; gap:3px; }
    .str-bar { width:24px; height:4px; border-radius:2px; background:rgba(255,255,255,0.04); transition:all 0.4s ease; }
    .str-bar.active.weak { background:#DD0031; box-shadow:0 0 6px rgba(221,0,49,0.3); }
    .str-bar.active.mid { background:#febc2e; box-shadow:0 0 6px rgba(254,188,46,0.3); }
    .str-bar.active.strong { background:#28c840; box-shadow:0 0 6px rgba(40,200,64,0.3); }
    .str-text { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:1px; text-transform:uppercase; color:#2a2a38; transition:color 0.3s; }
    .str-text.weak { color:#DD0031; }
    .str-text.mid { color:#febc2e; }
    .str-text.strong { color:#28c840; }
    .mismatch,.match { display:flex; align-items:center; gap:6px; margin-top:8px; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.5px; animation:fadeMsg 0.3s ease; }
    .mismatch { color:#DD0031; }
    .match { color:#28c840; }
    @keyframes fadeMsg { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }

    /* ═══ OPTIONS ═══ */
    .opts { display:flex; align-items:center; margin-bottom:22px; opacity:0; animation:slideR 0.5s ease 0.7s forwards; }
    .chk { display:flex; align-items:center; gap:9px; cursor:pointer; user-select:none; font-size:12px; color:#555568; }
    .chk-box { width:16px; height:16px; border:1.5px solid rgba(255,255,255,0.1); border-radius:4px; position:relative; background:#10101c; display:flex; align-items:center; justify-content:center; transition:all 0.3s; flex-shrink:0; }
    .chk-box input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; padding:0; border:none; }
    .chk-box svg { width:10px; height:10px; opacity:0; transform:scale(0); transition:all 0.2s; color:#060608; }
    .chk-box input:checked ~ svg { opacity:1; transform:scale(1); }
    .chk-box:has(input:checked) { background:linear-gradient(135deg,#DD0031,#1793D1); border-color:transparent; }
    .terms-link { color:#1793D1; text-decoration:none; transition:color 0.2s; }
    .terms-link:hover { color:#38b6f0; }

    /* ═══ SUBMIT ═══ */
    .submit { width:100%; padding:15px; border:none; border-radius:8px; font-family:'Chakra Petch',sans-serif; font-size:13px; font-weight:700; letter-spacing:5px; text-transform:uppercase; color:#fff; cursor:pointer; position:relative; overflow:hidden; background:linear-gradient(135deg,#DD0031 0%,#a040b0 50%,#1793D1 100%); background-size:250% 250%; animation:gradM 6s ease infinite,slideR 0.5s ease 0.8s forwards; opacity:0; transition:transform 0.2s,box-shadow 0.3s,opacity 0.3s; }
    @keyframes gradM { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    .submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 30px rgba(221,0,49,0.25),0 8px 30px rgba(23,147,209,0.15); }
    .submit:active:not(:disabled) { transform:translateY(0) scale(0.98); }
    .submit:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
    .submit::after { content:''; position:absolute; top:-50%; left:-70%; width:50%; height:200%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); transform:skewX(-25deg); transition:left 0.7s ease; }
    .submit:hover:not(:disabled)::after { left:130%; }
    .submit-inner { position:relative; z-index:2; display:flex; align-items:center; justify-content:center; gap:10px; }
    .spin { display:inline-block; width:18px; height:18px; border:2px solid rgba(255,255,255,0.2); border-top-color:#fff; border-radius:50%; animation:rot 0.6s linear infinite; }
    @keyframes rot { to{transform:rotate(360deg)} }

    /* ═══ DIVIDER ═══ */
    .divider { display:flex; align-items:center; gap:14px; margin:22px 0; opacity:0; animation:slideR 0.5s ease 0.9s forwards; }
    .divider-line { flex:1; height:1px; background:rgba(255,255,255,0.05); }
    .divider-txt { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:3px; text-transform:uppercase; color:#2a2a38; }

    /* ═══ SOCIALS ═══ */
    .socials { display:flex; gap:10px; opacity:0; animation:slideR 0.5s ease 1s forwards; }
    .soc { flex:1; padding:11px; border:1px solid rgba(255,255,255,0.06); border-radius:8px; background:#10101c; color:#555568; cursor:pointer; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.5px; display:flex; align-items:center; justify-content:center; gap:7px; transition:all 0.3s; }
    .soc:hover { border-color:rgba(255,255,255,0.1); color:#dcdce4; transform:translateY(-1px); }
    .soc svg { width:15px; height:15px; }
    .form-foot { text-align:center; margin-top:24px; opacity:0; animation:slideR 0.5s ease 1.1s forwards; }
    .form-foot p { font-size:13px; color:#555568; }
    .form-foot a { color:#1793D1; text-decoration:none; font-weight:600; transition:color 0.3s; }
    .form-foot a:hover { color:#38b6f0; }
    .ver { position:absolute; bottom:16px; right:20px; font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:2px; color:#2a2a38; text-transform:uppercase; opacity:0; animation:slideR 0.5s ease 1.2s forwards; }

    /* ═══ MODAL ═══ */
    .modal-overlay {
      position:fixed; inset:0; z-index:5000;
      background:rgba(0,0,0,0.75); backdrop-filter:blur(12px);
      display:flex; align-items:center; justify-content:center;
      pointer-events:all;
      animation:modalFadeIn 0.3s ease;
    }

    @keyframes modalFadeIn { from{opacity:0} to{opacity:1} }

    .modal-box {
      background:#0d0d18;
      border:1px solid rgba(255,255,255,0.08);
      border-radius:16px;
      padding:40px 48px;
      text-align:center;
      max-width:380px;
      width:90%;
      box-shadow:0 20px 60px rgba(0,0,0,0.6);
      animation:modalSlideUp 0.4s cubic-bezier(0.16,1,0.3,1);
    }

    @keyframes modalSlideUp {
      from { opacity:0; transform:translateY(30px) scale(0.95); }
      to { opacity:1; transform:translateY(0) scale(1); }
    }

    .modal-icon {
      width:80px; height:80px;
      margin:0 auto 20px;
      animation:modalIconPulse 2s ease-in-out infinite;
    }

    .modal-icon svg { width:100%; height:100%; }

    @keyframes modalIconPulse {
      0%,100% { transform:scale(1); }
      50% { transform:scale(1.05); }
    }

    .modal-title {
      font-size:20px; font-weight:700;
      letter-spacing:2px; text-transform:uppercase;
      color:#e8e8f0; margin-bottom:6px;
    }

    .modal-sub {
      font-size:12px; color:#555568;
      margin-bottom:24px; letter-spacing:0.3px;
    }

    /* Terminal status lines */
    .modal-term {
      text-align:left;
      background:rgba(0,0,0,0.3);
      border:1px solid rgba(255,255,255,0.04);
      border-radius:8px;
      padding:12px 14px;
      margin-bottom:20px;
    }

    .mt-line {
      display:flex; align-items:center; gap:8px;
      padding:5px 0;
      opacity:0.3;
      transition:opacity 0.4s ease;
    }

    .mt-line.done { opacity:1; }

    .mt-pip {
      width:6px; height:6px; border-radius:50%;
      background:#2a2a38;
      transition:all 0.4s ease;
      flex-shrink:0;
    }

    .mt-line.done .mt-pip {
      background:#28c840;
      box-shadow:0 0 8px rgba(40,200,64,0.5);
    }

    .mt-txt {
      font-family:'JetBrains Mono',monospace;
      font-size:11px; color:#3a3a48;
      transition:color 0.4s ease;
    }

    .mt-line.done .mt-txt { color:#7a7a88; }

    .mt-line:last-child.done .mt-txt {
      color:#28c840;
      font-weight:500;
    }

    /* Progress bar */
    .modal-bar-wrap {
      width:100%; height:6px;
      background:rgba(255,255,255,0.04);
      border-radius:3px;
      overflow:hidden;
      margin-bottom:8px;
    }

    .modal-bar {
      height:100%; border-radius:3px;
      background:linear-gradient(90deg,#DD0031,#a040b0,#1793D1,#28c840);
      background-size:300% 100%;
      animation:barGrad 3s ease infinite;
      transition:width 0.3s ease;
    }

    @keyframes barGrad {
      0% { background-position:0% 50%; }
      50% { background-position:100% 50%; }
      100% { background-position:0% 50%; }
    }

    .modal-pct {
      font-family:'JetBrains Mono',monospace;
      font-size:10px; color:#555568;
      letter-spacing:1px;
    }

    @media (max-width:960px) {
      .page { flex-direction:column; overflow-y:auto; }
      .panel-left { min-height:35vh; padding:40px 30px; }
      .panel-right { width:100%; min-height:auto; padding:40px 30px; }
      .brand h1 { font-size:32px; letter-spacing:4px; }
      .icon-stage { width:170px; height:170px; }
    }

    @media (max-width:480px) {
      .panel-left { padding:30px 20px; min-height:30vh; }
      .panel-right { padding:30px 20px; }
      .brand h1 { font-size:26px; letter-spacing:3px; }
      .icon-stage { width:140px; height:140px; }
      .form-head h2 { font-size:22px; }
      .modal-box { padding:30px 28px; }
    }
        .field-err {
      display:flex; align-items:center; gap:6px;
      margin-top:6px; padding:6px 10px;
      background:rgba(221,0,49,0.06);
      border-left:2px solid #DD0031;
      border-radius:0 6px 6px 0;
      font-family:'JetBrains Mono',monospace;
      font-size:10px; color:#DD0031;
      letter-spacing:0.3px;
      animation:fadeMsg 0.3s ease;
    }

    .field-err-general {
      margin-top:12px;
      justify-content:center;
      border-left:none;
      border:1px solid rgba(221,0,49,0.12);
      border-radius:8px;
      padding:10px 14px;
      font-size:11px;
    }
  `]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;
  showPwd = signal(false);
  showConfirm = signal(false);
  loading = signal(false);
  showModal = signal(false);
  modalStep = signal(0);
  modalProgress = signal(0);

  // Errores por campo
  errUsername = signal('');
  errEmail = signal('');
  errPassword = signal('');
  errConfirm = signal('');
  errGeneral = signal('');

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  get ruleLength(): boolean { return this.password.length >= 8; }
  get ruleUppercase(): boolean { return /[A-Z]/.test(this.password); }
  get ruleNumbers(): boolean { return ((this.password.match(/[0-9]/g) || []).length) >= 2; }
  get ruleSpecial(): boolean { return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(this.password); }
  get lengthProgress(): number { return Math.min((this.password.length / 8) * 100, 100); }
  get numbersProgress(): number { return Math.min(((this.password.match(/[0-9]/g) || []).length / 2) * 100, 100); }
  get strength(): number { let s = 0; if (this.ruleLength) s++; if (this.ruleUppercase) s++; if (this.ruleNumbers) s++; if (this.ruleSpecial) s++; return s; }
  get strengthLabel(): string { return ['','D\u00e9bil','Media','Fuerte','Excelente'][this.strength]; }

  passwordsMatch(): boolean { return this.password.length > 0 && this.password === this.confirmPassword; }

  canSubmit(): boolean {
    return (
      this.username.trim().length > 0 &&
      this.email.trim().length > 0 &&
      this.ruleLength &&
      this.ruleUppercase &&
      this.ruleNumbers &&
      this.ruleSpecial &&
      this.passwordsMatch() &&
      this.acceptTerms
    );
  }

  private clearErrors(): void {
    this.errUsername.set('');
    this.errEmail.set('');
    this.errPassword.set('');
    this.errConfirm.set('');
    this.errGeneral.set('');
  }

  private validateFields(): boolean {
    this.clearErrors();
    let valid = true;

    // Username
    if (this.username.trim().length === 0) {
      this.errUsername.set('El nombre de usuario es requerido');
      valid = false;
    } else if (this.username.trim().length < 3) {
      this.errUsername.set('El nombre debe tener al menos 3 caracteres');
      valid = false;
    } else if (this.username.trim().length > 50) {
      this.errUsername.set('El nombre no puede superar 50 caracteres');
      valid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(this.username.trim())) {
      this.errUsername.set('Solo letras, numeros y guion bajo');
      valid = false;
    }

    // Email
    if (this.email.trim().length === 0) {
      this.errEmail.set('El email es requerido');
      valid = false;
    } else if (!this.email.includes('@') || !this.email.includes('.')) {
      this.errEmail.set('Formato de email invalido');
      valid = false;
    } else if (this.email.trim().length > 100) {
      this.errEmail.set('El email no puede superar 100 caracteres');
      valid = false;
    }

    // Password
    if (this.password.length === 0) {
      this.errPassword.set('La contrase\u00f1a es requerida');
      valid = false;
    } else if (!this.ruleLength) {
      this.errPassword.set('Debe tener al menos 8 caracteres');
      valid = false;
    } else if (!this.ruleUppercase) {
      this.errPassword.set('Debe contener al menos 1 mayuscula');
      valid = false;
    } else if (!this.ruleNumbers) {
      this.errPassword.set('Debe contener al menos 2 numeros');
      valid = false;
    } else if (!this.ruleSpecial) {
      this.errPassword.set('Debe contener al menos 1 caracter especial');
      valid = false;
    }

    // Confirm
    if (this.confirmPassword.length === 0) {
      this.errConfirm.set('Confirma tu contrase\u00f1a');
      valid = false;
    } else if (!this.passwordsMatch()) {
      this.errConfirm.set('Las contrase\u00f1as no coinciden');
      valid = false;
    }

    // Terms
    if (!this.acceptTerms) {
      this.errGeneral.set('Debes aceptar los terminos y condiciones');
      valid = false;
    }

    return valid;
  }

  onRegister(): void {
    if (this.loading()) return;

    if (!this.validateFields()) return;

    this.loading.set(true);
    this.showModal.set(true);
    this.modalStep.set(0);
    this.modalProgress.set(0);

    // Step 1: Validando
    setTimeout(() => {
      this.modalStep.set(1);
      this.modalProgress.set(25);
    }, 500);

    // Step 2: Encriptando
    setTimeout(() => {
      this.modalStep.set(2);
      this.modalProgress.set(50);
    }, 1200);

    // Step 3: Llamada real al backend
    setTimeout(() => {
      this.http.post<any>('http://localhost:8080/api/auth/register', {
        username: this.username.trim(),
        email: this.email.trim().toLowerCase(),
        password: this.password
      }).subscribe({
        next: (res) => {
          this.modalStep.set(3);
          this.modalProgress.set(75);

          setTimeout(() => {
            this.modalStep.set(4);
            this.modalProgress.set(100);
          }, 800);

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          this.showModal.set(false);
          this.loading.set(false);

          const msg = err.error?.error || 'Error al crear la cuenta';

          // Mapear errores del backend al campo correcto
          if (msg.toLowerCase().includes('usuario') && msg.toLowerCase().includes('email')) {
            this.errGeneral.set('El usuario o email ya esta registrado');
          } else if (msg.toLowerCase().includes('username') || msg.toLowerCase().includes('usuario')) {
            this.errUsername.set('Este nombre de usuario ya esta en uso');
          } else if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('correo')) {
            this.errEmail.set('Este email ya esta registrado');
          } else if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('contrase')) {
            this.errPassword.set(msg);
          } else {
            this.errGeneral.set(msg);
          }
        }
      });
    }, 1800);
  }
}