// src/app/desktop/apps/gonet-app/services/register.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// ═══ LO QUE EL BACKEND ESPERA (REGISTER) ═══
export interface RegisterRequest {
  username: string;
  email: string;
  displayName: string;
  password: string;
  avatarBase64?: string;
}

// ═══ LO QUE EL BACKEND ESPERA (LOGIN) ═══
export interface LoginRequest {
  email: string;
  password: string;
}

// ═══ LO QUE EL BACKEND ESPERA (LINK ARCHSGO) ═══
export interface LinkArchsGoRequest {
  archsGoUsernameOrEmail: string;
  archsGoPassword: string;
  displayName: string;
  avatarBase64?: string;   // ⬅️ NUEVO — foto opcional que se guarda en wwwroot
}

// ═══ LO QUE EL BACKEND DEVUELVE (LOGIN/REGISTER/LINK) ═══
export interface AuthResponse {
  success: boolean;
  token: string;
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    displayName: string;
    avatarUrl: string;
    bio: string;
    estado: string;
    fechaCreacion: string;
    lastLogin: string | null;
  };
}

// ═══ LO QUE EL BACKEND DEVUELVE (REGISTER) ═══
export interface UsuarioDto {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  estado: string;
  tieneCuentaArchsGo: boolean;
  fechaCreacion: string;
  token: string;
}

// ═══ LO QUE EL BACKEND DEVUELVE SI ERROR ═══
export interface ApiError {
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:5124/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * POST /api/auth/register
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      data
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * POST /api/auth/login
   */
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      data
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * POST /api/auth/link-archsgo
   * Login federado / registro por vinculación con ArchsGo.
   * El endpoint es público (no requiere JWT): la validación la hace ArchsGo.
   */
  linkArchsGo(data: LinkArchsGoRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/link-archsgo`,
      data
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Convierte la foto de perfil a base64
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Guarda el token en localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem('gonet_token', token);
  }

  /**
   * Guarda los datos del usuario en localStorage
   */
  saveUser(response: AuthResponse): void {
    localStorage.setItem('gonet_user', JSON.stringify(response));
  }

  /**
   * Obtiene el token guardado
   */
  getToken(): string | null {
    return localStorage.getItem('gonet_token');
  }

  /**
   * Obtiene el usuario guardado
   */
  getUser(): AuthResponse | null {
    const data = localStorage.getItem('gonet_user');
    return data ? JSON.parse(data) : null;
  }

  /**
   * Elimina todo al cerrar sesion
   */
  logout(): void {
    localStorage.removeItem('gonet_token');
    localStorage.removeItem('gonet_user');
  }

  /**
   * Si hay un usuario guardado, esta logueado
   */
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Manejo centralizado de errores HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let mensaje = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      mensaje = `Error: ${error.error.message}`;
    } else {
      if (error.error?.message) {
        mensaje = error.error.message;
      } else if (error.error?.error) {
        mensaje = error.error.error;
      } else {
        mensaje = `Error ${error.status}: ${error.message}`;
      }
    }

    console.error('RegisterService error:', mensaje);
    return throwError(() => ({ error: mensaje }));
  }
}