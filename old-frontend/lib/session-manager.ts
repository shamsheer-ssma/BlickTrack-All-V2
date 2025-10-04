import { AuthUser } from './auth-service';

export interface SessionInfo {
  id: string;
  expiresAt: string;
  lastActivityAt: string;
  riskLevel: string;
  timeout: number;
}

export interface SessionManagerConfig {
  checkInterval: number; // milliseconds
  warningTime: number; // milliseconds before expiry to show warning
  autoRefresh: boolean;
  onSessionExpired: () => void;
  onSessionWarning: (timeLeft: number) => void;
  onSessionRefresh: (newToken: string) => void;
}

export class SessionManager {
  private config: SessionManagerConfig;
  private checkInterval: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private sessionInfo: SessionInfo | null = null;
  private isRefreshing: boolean = false;

  constructor(config: SessionManagerConfig) {
    this.config = config;
    this.startActivityTracking();
    this.startSessionMonitoring();
  }

  /**
   * Initialize session with server data
   */
  initializeSession(sessionInfo: SessionInfo): void {
    this.sessionInfo = sessionInfo;
    this.lastActivity = Date.now();
    this.startSessionMonitoring();
  }

  /**
   * Update session info after refresh
   */
  updateSession(sessionInfo: Partial<SessionInfo>): void {
    if (this.sessionInfo) {
      this.sessionInfo = { ...this.sessionInfo, ...sessionInfo };
    }
  }

  /**
   * Get current session info
   */
  getSessionInfo(): SessionInfo | null {
    return this.sessionInfo;
  }

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    if (!this.sessionInfo) return false;
    
    const now = Date.now();
    const expiresAt = new Date(this.sessionInfo.expiresAt).getTime();
    
    return expiresAt > now;
  }

  /**
   * Get time until session expires
   */
  getTimeUntilExpiry(): number {
    if (!this.sessionInfo) return 0;
    
    const now = Date.now();
    const expiresAt = new Date(this.sessionInfo.expiresAt).getTime();
    
    return Math.max(0, expiresAt - now);
  }

  /**
   * Refresh session token
   */
  async refreshSession(): Promise<boolean> {
    if (this.isRefreshing) return false;
    
    this.isRefreshing = true;
    
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          refreshToken: this.getRefreshToken(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          this.config.onSessionRefresh(data.data.accessToken);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Session refresh failed:', error);
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Logout current session
   */
  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.clearSession();
      this.config.onSessionExpired();
    }
  }

  /**
   * Logout all sessions
   */
  async logoutAllSessions(): Promise<void> {
    try {
      await fetch('/api/auth/logout-all', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout all sessions failed:', error);
    } finally {
      this.clearSession();
      this.config.onSessionExpired();
    }
  }

  /**
   * Get user sessions
   */
  async getUserSessions(): Promise<any[]> {
    try {
      const response = await fetch('/api/auth/sessions', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      }
      
      return [];
    } catch (error) {
      console.error('Get user sessions failed:', error);
      return [];
    }
  }

  /**
   * Start activity tracking
   */
  private startActivityTracking(): void {
    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const updateActivity = () => {
      this.lastActivity = Date.now();
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.lastActivity = Date.now();
        this.checkSession();
      }
    });
  }

  /**
   * Start session monitoring
   */
  private startSessionMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.checkSession();
    }, this.config.checkInterval);
  }

  /**
   * Check session status
   */
  private async checkSession(): Promise<void> {
    if (!this.sessionInfo) return;

    const now = Date.now();
    const timeUntilExpiry = this.getTimeUntilExpiry();
    const timeSinceActivity = now - this.lastActivity;

    // Check if session is expired
    if (timeUntilExpiry <= 0) {
      this.config.onSessionExpired();
      return;
    }

    // Check if user has been idle too long
    if (timeSinceActivity > this.sessionInfo.timeout) {
      this.config.onSessionExpired();
      return;
    }

    // Show warning if approaching expiry
    if (timeUntilExpiry <= this.config.warningTime && timeUntilExpiry > 0) {
      this.config.onSessionWarning(timeUntilExpiry);
    }

    // Auto-refresh if enabled and approaching expiry
    if (this.config.autoRefresh && timeUntilExpiry <= 5 * 60 * 1000) { // 5 minutes
      await this.refreshSession();
    }
  }

  /**
   * Get refresh token from cookie
   */
  private getRefreshToken(): string | null {
    const cookies = document.cookie.split(';');
    const refreshCookie = cookies.find(cookie => 
      cookie.trim().startsWith('blicktrack_refresh=')
    );
    
    if (refreshCookie) {
      return refreshCookie.split('=')[1];
    }
    
    return null;
  }

  /**
   * Clear session data
   */
  private clearSession(): void {
    this.sessionInfo = null;
    this.lastActivity = Date.now();
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Destroy session manager
   */
  destroy(): void {
    this.clearSession();
  }
}

// Default configuration
export const defaultSessionConfig: SessionManagerConfig = {
  checkInterval: 30000, // 30 seconds
  warningTime: 5 * 60 * 1000, // 5 minutes
  autoRefresh: true,
  onSessionExpired: () => {
    // Redirect to login page
    window.location.href = '/auth/login';
  },
  onSessionWarning: (timeLeft: number) => {
    // Show warning modal
    const minutes = Math.ceil(timeLeft / 60000);
    alert(`Your session will expire in ${minutes} minutes. Please save your work.`);
  },
  onSessionRefresh: (newToken: string) => {
    // Update stored token if needed
    console.log('Session refreshed successfully');
  },
};

// Global session manager instance
let globalSessionManager: SessionManager | null = null;

export function getSessionManager(): SessionManager | null {
  return globalSessionManager;
}

export function initializeSessionManager(config?: Partial<SessionManagerConfig>): SessionManager {
  if (globalSessionManager) {
    globalSessionManager.destroy();
  }

  const finalConfig = { ...defaultSessionConfig, ...config };
  globalSessionManager = new SessionManager(finalConfig);
  
  return globalSessionManager;
}

export function destroySessionManager(): void {
  if (globalSessionManager) {
    globalSessionManager.destroy();
    globalSessionManager = null;
  }
}

