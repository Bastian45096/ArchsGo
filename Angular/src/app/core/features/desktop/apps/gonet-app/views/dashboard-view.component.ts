import { Component, signal, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Server {
  id: string; name: string; icon: string; color: string;
  unread: number; hasPing: boolean;
}

interface Channel {
  id: string; name: string; type: 'text' | 'voice' | 'announcement';
  unread: number; category: string;
}

interface Member {
  id: string; name: string; avatar: string; status: 'online' | 'idle' | 'dnd' | 'offline';
  role: string; roleColor: string; bio: string;
}

interface Message {
  id: string; userId: string; userName: string; userAvatar: string;
  content: string; timestamp: Date; reactions: { emoji: string; count: number }[];
  isEdited: boolean; replyTo?: { user: string; content: string };
  isHighlighted?: boolean;
}

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gn-app">

      <!-- ═══════════════════ TOPBAR ═══════════════════ -->
      <header class="gn-top">
        <div class="gn-top-l">
          <div class="gn-top-pill" [style.background]="activeServer()?.color">
            {{ activeServer()?.icon }}
          </div>
          <div class="gn-top-info">
            <span class="gn-top-srv">{{ activeServer()?.name }}</span>
            <span class="gn-top-sep">/</span>
            <span class="gn-top-ch">#{{ activeChannel()?.name }}</span>
          </div>
        </div>
        <div class="gn-top-c">
          <div class="gn-top-topic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Bienvenidos al canal general de GoNET</span>
          </div>
        </div>
        <div class="gn-top-r">
          <div class="gn-top-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Buscar</span>
          </div>
          <div class="gn-top-user">
            <img [src]="currentUser().avatar" alt="">
            <div class="gn-top-user-dot online"></div>
          </div>
        </div>
      </header>

      <!-- ═══════════════════ BODY ═══════════════════ -->
      <div class="gn-body">

        <!-- SERVER RAIL -->
        <nav class="gn-rail">
          <div class="gn-rail-home" [class.active]="activeServer()?.id === 'home'" (click)="selectServer(homeServer)">
            <svg viewBox="0 0 80 80" fill="none" width="30" height="30">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#DD0031" stroke-width="2" stroke-dasharray="40 24" stroke-linecap="round" opacity="0.7">
                <animateTransform attributeName="transform" type="rotate" values="0 40 40;360 40 40" dur="16s" repeatCount="indefinite"/>
              </circle>
              <path d="M40 14 L58 58 L22 58 Z" fill="none" stroke="#DD0031" stroke-width="1.8" opacity="0.5"/>
              <path d="M33 28 L40 14 L47 28" stroke="#DD0031" stroke-width="1.8" stroke-linecap="round" fill="none"/>
            </svg>
          </div>
          <div class="gn-rail-line"></div>
          <div *ngFor="let srv of servers()" class="gn-rail-srv"
               [class.active]="activeServer()?.id === srv.id"
               [class.has-unread]="srv.unread > 0"
               (click)="selectServer(srv)">
            <div class="gn-rail-icon" [style.--srv-clr]="srv.color">
              <span>{{ srv.icon }}</span>
            </div>
            <div class="gn-rail-indicator" [style.background]="srv.color"></div>
            <span class="gn-rail-badge" *ngIf="srv.unread > 0">{{ srv.unread }}</span>
            <div class="gn-rail-tip">
              <span>{{ srv.name }}</span>
              <div class="gn-rail-tip-arrow"></div>
            </div>
          </div>
          <div class="gn-rail-line"></div>
          <div class="gn-rail-srv gn-rail-add">
            <div class="gn-rail-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <div class="gn-rail-tip"><span>Crear servidor</span><div class="gn-rail-tip-arrow"></div></div>
          </div>
        </nav>

        <!-- CHANNEL SIDEBAR -->
        <aside class="gn-side">
          <div class="gn-side-head">
            <span>{{ activeServer()?.name }}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="gn-side-scroll">
            <ng-container *ngFor="let cat of channelCategories">
              <div class="gn-cat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="8" height="8"><polyline points="6 9 12 15 18 9"/></svg>
                <span>{{ cat }}</span>
              </div>
              <div *ngFor="let ch of getChannelsByCategory(cat)" class="gn-ch"
                   [class.active]="activeChannel()?.id === ch.id"
                   (click)="selectChannel(ch)">
                <svg *ngIf="ch.type === 'text'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M4 9h16M4 15h16M10 3l-2 18M16 3l-2 18"/></svg>
                <svg *ngIf="ch.type === 'voice'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                <svg *ngIf="ch.type === 'announcement'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span class="gn-ch-name">{{ ch.name }}</span>
                <span class="gn-ch-unread" *ngIf="ch.unread > 0">{{ ch.unread }}</span>
              </div>
            </ng-container>
          </div>

          <!-- User bar -->
          <div class="gn-ubar">
            <div class="gn-ubar-avatar">
              <img [src]="currentUser().avatar" alt="">
              <div class="gn-ubar-dot online"></div>
            </div>
            <div class="gn-ubar-info">
              <span class="gn-ubar-name">{{ currentUser().name }}</span>
              <span class="gn-ubar-tag">{{ currentUser().tag }}</span>
            </div>
            <div class="gn-ubar-btns">
              <button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/></svg></button>
              <button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82.33V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.09 15a1.65 1.65 0 0 0-1.51-1.08H1a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 2.6 8.91a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.32 9c.28.5.85.84 1.47.91H22a2 2 0 0 1 0 4h-.09c-.62.07-1.19.41-1.47.91z"/></svg></button>
            </div>
          </div>
        </aside>

        <!-- ═══ CHAT ═══ -->
        <main class="gn-chat">

          <div class="gn-chat-head">
            <div class="gn-ch-head-l">
              <span class="gn-ch-hash">#</span>
              <span class="gn-ch-title">{{ activeChannel()?.name }}</span>
              <div class="gn-ch-divider-v"></div>
              <span class="gn-ch-desc">Bienvenidos al canal general de GoNET</span>
            </div>
            <div class="gn-ch-head-r">
              <button class="gn-ch-btn" [class.active]="showMembers()" (click)="showMembers.set(!showMembers())">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </button>
              <button class="gn-ch-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 17v5M9 11V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7M5 11h14l-1.5 6H6.5L5 11z"/></svg>
              </button>
            </div>
          </div>

          <!-- Welcome -->
          <div class="gn-welcome">
            <div class="gn-welcome-icon">
              <span>#</span>
            </div>
            <h1>Bienvenido a <strong>#{{ activeChannel()?.name }}</strong></h1>
            <p>Este es el inicio del canal.</p>
          </div>

          <div class="gn-dateline">
            <span>14 de septiembre de 2026</span>
          </div>

          <!-- Messages -->
          <div class="gn-msgs" #messagesContainer>
            <div *ngFor="let msg of messages(); let i = index" class="gn-msg"
                 [class.msg-hl]="msg.isHighlighted"
                 [class.msg-compact]="isCompact(i)"
                 (mouseenter)="hoveredMsg.set(msg.id)" (mouseleave)="hoveredMsg.set('')">

              <!-- Reply -->
              <div class="gn-msg-reply" *ngIf="msg.replyTo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>
                <img [src]="getAvatarByName(msg.replyTo.user)" alt="" class="gn-reply-mini">
                <span class="gn-reply-name">{{ msg.replyTo.user }}</span>
                <span class="gn-reply-text">{{ msg.replyTo.content }}</span>
              </div>

              <div class="gn-msg-main">
                <!-- Avatar (only if not compact) -->
                <div class="gn-msg-av" *ngIf="!isCompact(i)">
                  <img [src]="msg.userAvatar" alt="">
                </div>
                <div class="gn-msg-av-spacer" *ngIf="isCompact(i)"></div>

                <div class="gn-msg-content">
                  <div class="gn-msg-header" *ngIf="!isCompact(i)">
                    <span class="gn-msg-author" [style.color]="getMemberColor(msg.userId)">{{ msg.userName }}</span>
                    <span class="gn-msg-role" [style.color]="getMemberColor(msg.userId)">{{ getMemberRole(msg.userId) }}</span>
                    <span class="gn-msg-time">{{ formatTime(msg.timestamp) }}</span>
                    <span class="gn-msg-edited" *ngIf="msg.isEdited">(editado)</span>
                  </div>
                  <div class="gn-msg-header-compact" *ngIf="isCompact(i)">
                    <span class="gn-msg-time-c">{{ formatTime(msg.timestamp) }}</span>
                  </div>
                  <div class="gn-msg-text">{{ msg.content }}</div>
                  <div class="gn-msg-reacts" *ngIf="msg.reactions.length > 0">
                    <button *ngFor="let r of msg.reactions" class="gn-react">
                      <span class="gn-react-emoji">{{ r.emoji }}</span>
                      <span class="gn-react-n">{{ r.count }}</span>
                    </button>
                    <button class="gn-react-add">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </button>
                  </div>
                </div>

                <!-- Hover tools -->
                <div class="gn-msg-tools" *ngIf="hoveredMsg() === msg.id">
                  <button title="Reaccionar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>
                  <button title="Responder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg></button>
                  <button title="Mas"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></button>
                </div>
              </div>
            </div>

            <!-- Typing -->
            <div class="gn-typing" *ngIf="typingUsers().length > 0">
              <div class="gn-tdots"><span></span><span></span><span></span></div>
              <span><strong>{{ typingUsers()[0] }}</strong> esta escribiendo...</span>
            </div>
          </div>

          <!-- Input -->
          <div class="gn-input-area">
            <div class="gn-input-wrap">
              <button class="gn-input-plus">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </button>
              <input type="text" [(ngModel)]="messageInput" (keydown.enter)="sendMessage()"
                     placeholder="Enviar mensaje a #{{ activeChannel()?.name }}">
              <div class="gn-input-btns">
                <button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></button>
                <button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>
                <button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg></button>
              </div>
            </div>
          </div>
        </main>

        <!-- ═══ MEMBERS ═══ -->
        <aside class="gn-mem" *ngIf="showMembers()">
          <div class="gn-mem-section">
            <span class="gn-mem-label">EN LINEA — {{ onlineMembers().length }}</span>
            <div *ngFor="let m of onlineMembers()" class="gn-mem-item">
              <div class="gn-mem-av">
                <img [src]="m.avatar" alt="">
                <div class="gn-mem-dot" [class]="'dot-' + m.status"></div>
              </div>
              <div class="gn-mem-info">
                <span class="gn-mem-name" [style.color]="m.roleColor">{{ m.name }}</span>
                <span class="gn-mem-role">{{ m.role }}</span>
              </div>
            </div>
          </div>
          <div class="gn-mem-section">
            <span class="gn-mem-label">INACTIVO — {{ offlineMembers().length }}</span>
            <div *ngFor="let m of offlineMembers()" class="gn-mem-item gn-mem-off">
              <div class="gn-mem-av">
                <img [src]="m.avatar" alt="">
                <div class="gn-mem-dot dot-offline"></div>
              </div>
              <div class="gn-mem-info">
                <span class="gn-mem-name" [style.color]="m.roleColor">{{ m.name }}</span>
                <span class="gn-mem-role">{{ m.role }}</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

    :host { display:block; width:100%; height:100%; }

    .gn-app {
      width:100%; height:100%;
      font-family:'Plus Jakarta Sans',sans-serif;
      display:flex; flex-direction:column;
      overflow:hidden;
      /* GRAY BASE */
      background:#2b2d31;
      color:#dbdee1;
    }

    /* ═══ TOPBAR ═══ */
    .gn-top {
      height:48px; flex-shrink:0;
      display:flex; align-items:center;
      background:#313338;
      border-bottom:1px solid rgba(0,0,0,0.2);
      padding:0 12px; gap:12px;
      z-index:100;
    }
    .gn-top-l { display:flex; align-items:center; gap:10px; }
    .gn-top-pill {
      width:28px; height:28px;
      border-radius:8px;
      display:flex; align-items:center; justify-content:center;
      font-size:10px; font-weight:800; color:#fff;
      letter-spacing:0.5px;
    }
    .gn-top-info { display:flex; align-items:center; gap:6px; }
    .gn-top-srv { font-size:14px; font-weight:700; color:#f2f3f5; }
    .gn-top-sep { color:#5c5e66; font-size:16px; font-weight:300; }
    .gn-top-ch { font-size:14px; font-weight:500; color:#949ba4; }
    .gn-top-c { flex:1; display:flex; justify-content:center; }
    .gn-top-topic {
      display:flex; align-items:center; gap:8px;
      font-size:12px; color:#6d6f78;
    }
    .gn-top-topic svg { color:#5c5e66; }
    .gn-top-r { display:flex; align-items:center; gap:12px; }
    .gn-top-search {
      display:flex; align-items:center; gap:8px;
      padding:6px 12px; min-width:140px;
      background:#1e1f22; border-radius:6px;
      font-size:12px; color:#6d6f78;
      cursor:pointer;
    }
    .gn-top-user {
      position:relative; width:32px; height:32px;
      cursor:pointer;
    }
    .gn-top-user img { width:100%; height:100%; border-radius:50%; }
    .gn-top-user-dot {
      position:absolute; bottom:-1px; right:-1px;
      width:12px; height:12px; border-radius:50%;
      border:3px solid #313338;
    }

    /* ═══ BODY ═══ */
    .gn-body { flex:1; display:flex; overflow:hidden; }

    /* ═══ SERVER RAIL ═══ */
    .gn-rail {
      width:72px; flex-shrink:0;
      display:flex; flex-direction:column;
      align-items:center; gap:4px;
      padding:12px 0;
      background:#1e1f22;
      overflow-y:auto;
    }
    .gn-rail::-webkit-scrollbar { display:none; }
    .gn-rail-home {
      width:48px; height:48px;
      border-radius:24px;
      display:flex; align-items:center; justify-content:center;
      background:#313338; cursor:pointer;
      transition:all 0.25s cubic-bezier(0.16,1,0.3,1);
      position:relative;
    }
    .gn-rail-home:hover { border-radius:16px; }
    .gn-rail-home.active { border-radius:16px; background:rgba(221,0,49,0.15); }
    .gn-rail-srv {
      position:relative; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
    }
    .gn-rail-icon {
      width:48px; height:48px;
      border-radius:24px;
      background:#313338;
      display:flex; align-items:center; justify-content:center;
      font-size:14px; font-weight:800; color:#dbdee1;
      transition:all 0.25s cubic-bezier(0.16,1,0.3,1);
      letter-spacing:0.5px;
    }
    .gn-rail-srv:hover .gn-rail-icon,
    .gn-rail-srv.active .gn-rail-icon { border-radius:16px; }
    .gn-rail-srv.active .gn-rail-icon {
      background:var(--srv-clr);
      color:#fff;
    }
    .gn-rail-srv:hover:not(.active) .gn-rail-icon {
      background:var(--srv-clr);
      color:#fff;
    }
    .gn-rail-indicator {
      position:absolute; left:-16px;
      width:8px; height:0; border-radius:0 4px 4px 0;
      transition:all 0.25s cubic-bezier(0.16,1,0.3,1);
    }
    .gn-rail-srv.active .gn-rail-indicator { height:40px; }
    .gn-rail-srv.has-unread .gn-rail-indicator { height:8px; }
    .gn-rail-srv.active.has-unread .gn-rail-indicator { height:40px; }
    .gn-rail-badge {
      position:absolute; bottom:-2px; right:-2px;
      min-width:18px; height:18px;
      background:#da373c; color:#fff;
      font-size:10px; font-weight:800;
      border-radius:9px;
      display:flex; align-items:center; justify-content:center;
      padding:0 4px;
      border:4px solid #1e1f22;
    }
    .gn-rail-line {
      width:32px; height:2px;
      background:rgba(255,255,255,0.06);
      border-radius:1px; margin:4px 0;
    }
    .gn-rail-add .gn-rail-icon {
      color:#23a559;
    }
    .gn-rail-add:hover .gn-rail-icon {
      background:rgba(35,165,89,0.15);
      color:#23a559;
    }

    /* Tooltip */
    .gn-rail-tip {
      position:absolute; left:62px;
      background:#111214;
      color:#dbdee1;
      padding:8px 12px;
      border-radius:6px;
      font-size:13px; font-weight:600;
      white-space:nowrap;
      pointer-events:none;
      opacity:0; transform:translateX(-8px);
      transition:all 0.15s;
      box-shadow:0 8px 24px rgba(0,0,0,0.4);
      z-index:999;
    }
    .gn-rail-tip-arrow {
      position:absolute; left:-4px; top:50%;
      transform:translateY(-50%) rotate(45deg);
      width:8px; height:8px;
      background:#111214;
    }
    .gn-rail-srv:hover .gn-rail-tip,
    .gn-rail-home:hover .gn-rail-tip {
      opacity:1; transform:translateX(0);
    }

    /* ═══ CHANNEL SIDEBAR ═══ */
    .gn-side {
      width:240px; flex-shrink:0;
      display:flex; flex-direction:column;
      background:#2b2d31;
    }
    .gn-side-head {
      height:48px;
      display:flex; align-items:center; justify-content:space-between;
      padding:0 16px;
      border-bottom:1px solid rgba(0,0,0,0.2);
      font-size:15px; font-weight:700;
      cursor:pointer; transition:background 0.15s;
    }
    .gn-side-head:hover { background:rgba(255,255,255,0.02); }
    .gn-side-head svg { color:#6d6f78; }
    .gn-side-scroll {
      flex:1; overflow-y:auto; padding:4px 0;
    }
    .gn-side-scroll::-webkit-scrollbar { width:4px; }
    .gn-side-scroll::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.3); border-radius:2px; }
    .gn-cat {
      display:flex; align-items:center; gap:4px;
      padding:16px 8px 4px 16px;
      font-size:11px; font-weight:700;
      letter-spacing:1.5px; text-transform:uppercase;
      color:#6d6f78; cursor:pointer;
    }
    .gn-cat:hover { color:#dbdee1; }
    .gn-ch {
      display:flex; align-items:center; gap:8px;
      padding:6px 8px 6px 18px;
      margin:1px 8px; border-radius:6px;
      cursor:pointer; color:#6d6f78;
      font-size:14px; transition:all 0.15s;
    }
    .gn-ch:hover { background:rgba(255,255,255,0.03); color:#dbdee1; }
    .gn-ch.active { background:rgba(255,255,255,0.06); color:#f2f3f5; }
    .gn-ch-name { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .gn-ch-unread {
      min-width:18px; height:18px;
      background:#da373c; color:#fff;
      font-size:10px; font-weight:800;
      border-radius:9px;
      display:flex; align-items:center; justify-content:center;
      padding:0 5px;
    }

    /* ═══ USER BAR ═══ */
    .gn-ubar {
      display:flex; align-items:center; gap:8px;
      padding:6px 8px;
      background:#232428;
      border-top:1px solid rgba(0,0,0,0.2);
    }
    .gn-ubar-avatar {
      position:relative; width:32px; height:32px; flex-shrink:0;
    }
    .gn-ubar-avatar img { width:100%; height:100%; border-radius:50%; }
    .gn-ubar-dot {
      position:absolute; bottom:-1px; right:-1px;
      width:12px; height:12px; border-radius:50%;
      border:3px solid #232428;
    }
    .gn-ubar-info { flex:1; overflow:hidden; }
    .gn-ubar-name { display:block; font-size:13px; font-weight:700; color:#f2f3f5; }
    .gn-ubar-tag { display:block; font-size:11px; color:#6d6f78; font-family:'IBM Plex Mono',monospace; }
    .gn-ubar-btns { display:flex; gap:2px; }
    .gn-ubar-btns button {
      width:32px; height:32px;
      display:flex; align-items:center; justify-content:center;
      background:transparent; border:none;
      border-radius:6px; color:#6d6f78;
      cursor:pointer; transition:all 0.15s;
    }
    .gn-ubar-btns button:hover { color:#dbdee1; background:rgba(255,255,255,0.04); }

    /* Status dots */
    .online { background:#23a559; }
    .gn-mem-dot.dot-online { background:#23a559; }
    .gn-mem-dot.dot-idle { background:#f0b232; }
    .gn-mem-dot.dot-dnd { background:#da373c; }
    .gn-mem-dot.dot-offline { background:#80848e; }

    /* ═══ CHAT ═══ */
    .gn-chat {
      flex:1; display:flex; flex-direction:column;
      overflow:hidden; min-width:0;
      background:#313338;
    }
    .gn-chat-head {
      height:48px; flex-shrink:0;
      display:flex; align-items:center; justify-content:space-between;
      padding:0 16px;
      border-bottom:1px solid rgba(0,0,0,0.2);
    }
    .gn-ch-head-l { display:flex; align-items:center; gap:8px; }
    .gn-ch-hash { font-size:22px; font-weight:800; color:#6d6f78; }
    .gn-ch-title { font-size:15px; font-weight:700; color:#f2f3f5; }
    .gn-ch-divider-v { width:1px; height:20px; background:rgba(255,255,255,0.06); margin:0 4px; }
    .gn-ch-desc { font-size:12px; color:#6d6f78; }
    .gn-ch-head-r { display:flex; gap:4px; }
    .gn-ch-btn {
      width:32px; height:32px;
      display:flex; align-items:center; justify-content:center;
      background:transparent; border:none;
      border-radius:6px; color:#6d6f78;
      cursor:pointer; transition:all 0.15s;
    }
    .gn-ch-btn:hover { color:#dbdee1; }
    .gn-ch-btn.active { color:#f2f3f5; background:rgba(255,255,255,0.04); }

    .gn-welcome {
      padding:20px 16px 12px;
    }
    .gn-welcome-icon {
      width:56px; height:56px;
      border-radius:50%;
      background:rgba(255,255,255,0.04);
      display:flex; align-items:center; justify-content:center;
      font-size:28px; font-weight:800; color:#6d6f78;
      margin-bottom:12px;
    }
    .gn-welcome h1 { font-size:28px; font-weight:800; margin:0 0 6px; color:#f2f3f5; }
    .gn-welcome h1 strong { font-weight:800; }
    .gn-welcome p { font-size:14px; color:#6d6f78; margin:0; }

    .gn-dateline {
      display:flex; align-items:center; gap:12px;
      padding:8px 16px;
    }
    .gn-dateline::before, .gn-dateline::after {
      content:''; flex:1; height:1px;
      background:rgba(255,255,255,0.04);
    }
    .gn-dateline span {
      font-size:11px; font-weight:700;
      color:#6d6f78; white-space:nowrap;
    }

    /* ═══ MESSAGES ═══ */
    .gn-msgs {
      flex:1; overflow-y:auto; padding:0 16px 16px;
    }
    .gn-msgs::-webkit-scrollbar { width:6px; }
    .gn-msgs::-webkit-scrollbar-thumb { background:#1a1b1e; border-radius:3px; }
    .gn-msg {
      position:relative;
      padding:4px 8px; border-radius:4px;
      transition:background 0.1s;
    }
    .gn-msg:hover { background:rgba(0,0,0,0.06); }
    .msg-hl { background:rgba(221,0,49,0.08); }

    .gn-msg-reply {
      display:flex; align-items:center; gap:6px;
      padding:2px 0 2px 52px;
      font-size:12px; color:#6d6f78;
    }
    .gn-msg-reply svg { color:#6d6f78; transform:rotate(180deg); }
    .gn-reply-mini { width:16px; height:16px; border-radius:50%; }
    .gn-reply-name { font-weight:600; color:#b5bac1; cursor:pointer; }
    .gn-reply-name:hover { color:#dbdee1; text-decoration:underline; }
    .gn-reply-text { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:400px; }

    .gn-msg-main { display:flex; gap:16px; }
    .gn-msg-av {
      flex-shrink:0; width:40px; padding-top:2px;
    }
    .gn-msg-av img { width:40px; height:40px; border-radius:50%; cursor:pointer; }
    .gn-msg-av-spacer { width:40px; flex-shrink:0; }

    .gn-msg-content { flex:1; min-width:0; }
    .gn-msg-header { display:flex; align-items:baseline; gap:8px; margin-bottom:2px; }
    .gn-msg-author { font-size:15px; font-weight:600; cursor:pointer; }
    .gn-msg-author:hover { text-decoration:underline; }
    .gn-msg-role {
      font-size:10px; font-weight:600;
      letter-spacing:1px; text-transform:uppercase;
      opacity:0.7;
    }
    .gn-msg-time { font-size:11px; color:#6d6f78; font-family:'IBM Plex Mono',monospace; }
    .gn-msg-edited { font-size:10px; color:#6d6f78; }
    .gn-msg-header-compact { display:none; }
    .gn-msg-compact:hover .gn-msg-header-compact {
      display:flex; align-items:center; gap:6px;
      position:absolute; left:-48px; top:6px;
      width:40px; justify-content:flex-end;
    }
    .gn-msg-time-c {
      font-size:9px; color:#6d6f78;
      font-family:'IBM Plex Mono',monospace;
    }
    .gn-msg-text { font-size:14px; color:#dbdee1; line-height:1.5; word-break:break-word; }

    .gn-msg-reacts { display:flex; flex-wrap:wrap; gap:4px; margin-top:4px; }
    .gn-react {
      display:flex; align-items:center; gap:4px;
      padding:2px 8px; border-radius:4px;
      background:rgba(255,255,255,0.03);
      border:1px solid rgba(255,255,255,0.06);
      cursor:pointer; transition:all 0.15s;
    }
    .gn-react:hover { border-color:rgba(255,255,255,0.12); background:rgba(255,255,255,0.06); }
    .gn-react-emoji { font-size:14px; }
    .gn-react-n {
      font-size:11px; color:#b5bac1;
      font-family:'IBM Plex Mono',monospace; font-weight:500;
    }
    .gn-react-add {
      width:26px; height:26px;
      border-radius:4px;
      background:transparent; border:1px solid rgba(255,255,255,0.04);
      cursor:pointer; color:#6d6f78;
      display:flex; align-items:center; justify-content:center;
      opacity:0; transition:all 0.15s;
    }
    .gn-msg:hover .gn-react-add { opacity:1; }
    .gn-react-add:hover { background:rgba(255,255,255,0.06); color:#dbdee1; }

    .gn-msg-tools {
      position:absolute; top:-12px; right:8px;
      display:flex; gap:1px; padding:2px;
      background:#2b2d31;
      border:1px solid rgba(0,0,0,0.3);
      border-radius:4px;
      box-shadow:0 4px 16px rgba(0,0,0,0.3);
    }
    .gn-msg-tools button {
      width:30px; height:28px;
      display:flex; align-items:center; justify-content:center;
      background:transparent; border:none;
      color:#6d6f78; cursor:pointer;
      border-radius:4px; transition:all 0.1s;
    }
    .gn-msg-tools button:hover {
      background:rgba(255,255,255,0.06); color:#dbdee1;
    }

    .gn-typing {
      display:flex; align-items:center; gap:8px;
      padding:6px 8px; font-size:12px; color:#6d6f78;
    }
    .gn-tdots { display:flex; gap:3px; }
    .gn-tdots span {
      width:5px; height:5px;
      background:#23a559; border-radius:50%;
      animation:tdBounce 1.4s ease-in-out infinite;
    }
    .gn-tdots span:nth-child(2) { animation-delay:0.2s; }
    .gn-tdots span:nth-child(3) { animation-delay:0.4s; }
    @keyframes tdBounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-4px); } }
    .gn-typing strong { color:#23a559; font-weight:600; }

    /* ═══ INPUT ═══ */
    .gn-input-area { padding:0 16px 24px; }
    .gn-input-wrap {
      display:flex; align-items:center;
      background:#383a40;
      border-radius:8px;
      transition:all 0.2s;
    }
    .gn-input-wrap:focus-within {
      box-shadow:0 0 0 1px rgba(255,255,255,0.06);
    }
    .gn-input-plus {
      width:44px; height:44px;
      display:flex; align-items:center; justify-content:center;
      background:transparent; border:none;
      color:#6d6f78; cursor:pointer;
      transition:color 0.15s;
    }
    .gn-input-plus:hover { color:#b5bac1; }
    .gn-input-wrap input {
      flex:1; padding:12px 0;
      background:transparent; border:none;
      color:#dbdee1; font-family:'Plus Jakarta Sans',sans-serif;
      font-size:14px; outline:none;
    }
    .gn-input-wrap input::placeholder { color:#6d6f78; }
    .gn-input-btns { display:flex; gap:2px; padding-right:4px; }
    .gn-input-btns button {
      width:36px; height:36px;
      display:flex; align-items:center; justify-content:center;
      background:transparent; border:none;
      color:#6d6f78; cursor:pointer;
      border-radius:4px; transition:all 0.15s;
    }
    .gn-input-btns button:hover { color:#b5bac1; }

    /* ═══ MEMBERS ═══ */
    .gn-mem {
      width:240px; flex-shrink:0;
      background:#2b2d31;
      overflow-y:auto; padding:12px 8px;
    }
    .gn-mem::-webkit-scrollbar { width:4px; }
    .gn-mem::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.3); border-radius:2px; }
    .gn-mem-section { margin-bottom:12px; }
    .gn-mem-label {
      display:block; font-size:11px; font-weight:700;
      letter-spacing:1.5px; text-transform:uppercase;
      color:#6d6f78; padding:6px 8px 10px;
    }
    .gn-mem-item {
      display:flex; align-items:center; gap:10px;
      padding:6px 8px; border-radius:6px;
      cursor:pointer; transition:background 0.15s;
    }
    .gn-mem-item:hover { background:rgba(255,255,255,0.03); }
    .gn-mem-off { opacity:0.4; }
    .gn-mem-av { position:relative; width:32px; height:32px; flex-shrink:0; }
    .gn-mem-av img { width:100%; height:100%; border-radius:50%; }
    .gn-mem-dot {
      position:absolute; bottom:-1px; right:-1px;
      width:12px; height:12px; border-radius:50%;
      border:3px solid #2b2d31;
    }
    .gn-mem-info { overflow:hidden; }
    .gn-mem-name { display:block; font-size:14px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .gn-mem-role { display:block; font-size:11px; color:#6d6f78; }

    /* ═══ RESPONSIVE ═══ */
    @media (max-width:1100px) { .gn-mem { display:none; } }
    @media (max-width:800px) {
      .gn-side { display:none; }
      .gn-rail { width:56px; }
      .gn-rail-icon { width:40px; height:40px; }
      .gn-rail-home { width:40px; height:40px; }
      .gn-top-topic { display:none; }
    }
  `]
})
export class DashboardViewComponent implements OnInit, AfterViewChecked {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  showMembers = signal(true);
  hoveredMsg = signal('');
  messageInput = '';
  shouldScroll = false;

  homeServer: Server = { id: 'home', name: 'Inicio', icon: '', color: '', unread: 0, hasPing: false };

  currentUser = signal({
    name: 'Xavier',
    avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Xavier&backgroundColor=2b2d31',
    status: 'online' as const,
    tag: '#8421'
  });

  servers = signal<Server[]>([
    { id: '1', name: 'GoNET Dev', icon: 'GN', color: '#DD0031', unread: 3, hasPing: true },
    { id: '2', name: 'ArchsGo', icon: 'AG', color: '#5865F2', unread: 0, hasPing: false },
    { id: '3', name: 'Proyecto INACAP', icon: 'IN', color: '#EB459E', unread: 12, hasPing: false },
    { id: '4', name: 'Gaming', icon: 'GM', color: '#23a559', unread: 0, hasPing: false },
  ]);

  channels = signal<Channel[]>([
    { id: 'c1', name: 'general', type: 'text', unread: 0, category: 'TEXTO' },
    { id: 'c2', name: 'anuncios', type: 'announcement', unread: 2, category: 'TEXTO' },
    { id: 'c3', name: 'backend', type: 'text', unread: 0, category: 'DESARROLLO' },
    { id: 'c4', name: 'frontend', type: 'text', unread: 1, category: 'DESARROLLO' },
    { id: 'c5', name: 'devops', type: 'text', unread: 0, category: 'DESARROLLO' },
    { id: 'c6', name: 'code-review', type: 'text', unread: 0, category: 'DESARROLLO' },
    { id: 'v1', name: 'General', type: 'voice', unread: 0, category: 'VOZ' },
    { id: 'v2', name: 'Pair Programming', type: 'voice', unread: 0, category: 'VOZ' },
  ]);

  members = signal<Member[]>([
    { id: 'u1', name: 'Xavier', avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Xavier&backgroundColor=2b2d31', status: 'online', role: 'Admin', roleColor: '#DD0031', bio: 'Creador de GoNET' },
    { id: 'u2', name: 'Bastian', avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Bastian&backgroundColor=2b2d31', status: 'online', role: 'DevOps', roleColor: '#5865F2', bio: 'Infraestructura' },
    { id: 'u3', name: 'Camila', avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Camila&backgroundColor=2b2d31', status: 'idle', role: 'Frontend', roleColor: '#EB459E', bio: 'Angular team' },
    { id: 'u4', name: 'Diego', avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Diego&backgroundColor=2b2d31', status: 'dnd', role: 'Backend', roleColor: '#23a559', bio: '.NET Core' },
    { id: 'u5', name: 'Elena', avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Elena&backgroundColor=2b2d31', status: 'online', role: 'Diseñadora', roleColor: '#f0b232', bio: 'UI/UX' },
    { id: 'u6', name: 'Felipe', avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Felipe&backgroundColor=2b2d31', status: 'offline', role: 'QA', roleColor: '#9b5de5', bio: 'Testing' },
    { id: 'u7', name: 'Gabriela', avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Gabriela&backgroundColor=2b2d31', status: 'offline', role: 'Backend', roleColor: '#23a559', bio: 'APIs' },
  ]);

  messages = signal<Message[]>([
    {
      id: 'm1', userId: 'u2', userName: 'Bastian',
      userAvatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Bastian&backgroundColor=2b2d31',
      content: 'Ya esta corriendo el pipeline de CI/CD, el deploy a Azure deberia estar listo en 5 minutos',
      timestamp: new Date('2026-09-14T23:15:00'), reactions: [{ emoji: '🚀', count: 3 }], isEdited: false
    },
    {
      id: 'm2', userId: 'u3', userName: 'Camila',
      userAvatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Camila&backgroundColor=2b2d31',
      content: 'Perfecto! Yo termine el componente del chat, ya tiene los mensajes en tiempo real con SignalR. Voy a hacer push en 10 min',
      timestamp: new Date('2026-09-14T23:16:30'), reactions: [{ emoji: '🔥', count: 2 }, { emoji: '👍', count: 4 }], isEdited: false,
      replyTo: { user: 'Bastian', content: 'Ya esta corriendo el pipeline de CI/CD...' }
    },
    {
      id: 'm3', userId: 'u1', userName: 'Xavier',
      userAvatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Xavier&backgroundColor=2b2d31',
      content: 'Yo acabo de configurar Azure Database, ya tenemos la BD en la nube. La connection string esta en appsettings y el firewall esta abierto para todos los IPs de desarrollo',
      timestamp: new Date('2026-09-14T23:18:00'), reactions: [{ emoji: '☁️', count: 5 }], isEdited: false
    },
    {
      id: 'm4', userId: 'u4', userName: 'Diego',
      userAvatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Diego&backgroundColor=2b2d31',
      content: 'El endpoint de registro ya esta funcionando con el middleware de logging. Me falta el de login, lo tengo en el branch feature/auth',
      timestamp: new Date('2026-09-14T23:20:15'), reactions: [], isEdited: true
    },
    {
      id: 'm5', userId: 'u5', userName: 'Elena',
      userAvatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Elena&backgroundColor=2b2d31',
      content: 'Chicos les comparto los nuevos mockups del dashboard. El layout es tipo Discord con rail de servidores a la izquierda. Les parece o prefieren algo mas tipo Teams?',
      timestamp: new Date('2026-09-14T23:22:00'), reactions: [{ emoji: '🎨', count: 3 }, { emoji: '💜', count: 2 }], isEdited: false
    },
    {
      id: 'm6', userId: 'u2', userName: 'Bastian',
      userAvatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Bastian&backgroundColor=2b2d31',
      content: 'Me gusta mas estilo Discord, la navegacion por servidores es mas intuitiva. Ademas si despues queremos multiples workspaces, ya esta la estructura',
      timestamp: new Date('2026-09-14T23:23:30'), reactions: [{ emoji: '✅', count: 4 }], isEdited: false,
      replyTo: { user: 'Elena', content: 'Les parece o prefieren algo mas tipo Teams?' }
    },
    {
      id: 'm7', userId: 'u1', userName: 'Xavier',
      userAvatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Xavier&backgroundColor=2b2d31',
      content: 'Discord 100%. Ademas podemos usar la rail de servidores para separar proyectos. Cada proyecto = un servidor con sus canales',
      timestamp: new Date('2026-09-14T23:25:00'), reactions: [{ emoji: '💯', count: 6 }], isEdited: false
    },
    {
      id: 'm8', userId: 'u3', userName: 'Camila',
      userAvatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Camila&backgroundColor=2b2d31',
      content: 'Ya hice push del componente. Los mensajes usan SignalR para tiempo real. Todavia no tiene persistencia, eso va en el proximo sprint',
      timestamp: new Date('2026-09-14T23:30:00'), reactions: [{ emoji: '🎉', count: 5 }, { emoji: '🚀', count: 3 }], isEdited: false
    },
    {
      id: 'm9', userId: 'u4', userName: 'Diego',
      userAvatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Diego&backgroundColor=2b2d31',
      content: 'Vi el PR. Se ve limpio. Solo un detalle: en el hub de SignalR falta el manejo de reconexion automatica',
      timestamp: new Date('2026-09-14T23:32:00'), reactions: [{ emoji: '👀', count: 2 }], isEdited: false
    },
    {
      id: 'm10', userId: 'u5', userName: 'Elena',
      userAvatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Elena&backgroundColor=2b2d31',
      content: 'Termine los iconos del rail de servidores. Cada servidor tiene su propio color de acento. Se ve brutal con el tema oscuro',
      timestamp: new Date('2026-09-14T23:35:00'), reactions: [{ emoji: '🖤', count: 3 }, { emoji: '✨', count: 4 }], isEdited: false
    }
  ]);

  typingUsers = signal<string[]>(['Camila']);
  activeServer = signal<Server | null>(null);
  activeChannel = signal<Channel | null>(null);

  ngOnInit(): void {
    this.selectServer(this.servers()[0]);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  selectServer(srv: Server): void {
    this.activeServer.set(srv);
    const firstText = this.channels().find(c => c.type === 'text');
    if (firstText) this.selectChannel(firstText);
  }

  selectChannel(ch: Channel): void {
    this.activeChannel.set(ch);
    this.shouldScroll = true;
  }

  sendMessage(): void {
    const text = this.messageInput.trim();
    if (!text) return;
    const newMsg: Message = {
      id: 'm' + Date.now(), userId: 'u1', userName: 'Xavier',
      userAvatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Xavier&backgroundColor=2b2d31',
      content: text, timestamp: new Date(), reactions: [], isEdited: false
    };
    this.messages.update(msgs => [...msgs, newMsg]);
    this.messageInput = '';
    this.shouldScroll = true;
  }

  isCompact(index: number): boolean {
    if (index === 0) return false;
    const msgs = this.messages();
    const prev = msgs[index - 1];
    const curr = msgs[index];
    const timeDiff = curr.timestamp.getTime() - prev.timestamp.getTime();
    return prev.userId === curr.userId && timeDiff < 300000 && !curr.replyTo;
  }

  getAvatarByName(name: string): string {
    const m = this.members().find(m => m.name === name);
    return m ? m.avatar : '';
  }

  get channelCategories(): string[] {
    return [...new Set(this.channels().map(c => c.category))];
  }

  getChannelsByCategory(cat: string): Channel[] {
    return this.channels().filter(c => c.category === cat);
  }

  onlineMembers(): Member[] {
    return this.members().filter(m => m.status !== 'offline');
  }

  offlineMembers(): Member[] {
    return this.members().filter(m => m.status === 'offline');
  }

  getMemberColor(userId: string): string {
    return this.members().find(m => m.id === userId)?.roleColor || '#dbdee1';
  }

  getMemberRole(userId: string): string {
    return this.members().find(m => m.id === userId)?.role || '';
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }
}