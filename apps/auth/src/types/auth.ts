// Auth state and response types for Telegram authentication
export interface AuthState {
  success: boolean;
  state: string;
  redirect_url: string;
  error?: string;
}

export interface AuthStatusResponse {
  success: boolean;
  completed: boolean;
  magic_link?: string;
  user_id?: string;
  message?: string;
  error?: string;
}

// Process auth request for Telegram mini app
export interface ProcessAuthRequest {
  state: string;
  telegram_user_id: number;
  telegram_full_name: string;
  telegram_username?: string;
  webhook_secret: string;
}