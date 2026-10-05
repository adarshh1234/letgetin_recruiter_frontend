import { create } from 'zustand';
import { AuthService, UserProfile } from '../services/authService';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  isLoading: boolean; // Alias for loading
  isInitialized: boolean;
  error: string | null;

  login: (data: { email?: string; phone?: string; emailOrPhone?: string; password: string }) => Promise<UserProfile>;
  googleLogin: (credential: string) => Promise<UserProfile>;
  sendEmailOtp: (email: string) => Promise<{ cooldown: number }>;
  verifyEmailOtp: (data: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    otp: string;
    role?: 'user' | 'recruiter';
    entityType?: 'company' | 'institution' | 'startup';
  }) => Promise<UserProfile>;

  sendOtp: (email: string) => Promise<{ cooldown: number }>; // Alias for sendEmailOtp
  verifyOtp: (data: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    otp: string;
    role?: 'user' | 'recruiter';
    entityType?: 'company' | 'institution' | 'startup';
  }) => Promise<UserProfile>; // Alias for verifyEmailOtp

  sendWhatsAppOtp: (data: { countryCode: string; phone: string }) => Promise<{ cooldown: number }>;
  verifyWhatsAppOtp: (data: {
    username: string;
    countryCode?: string;
    phone: string;
    password: string;
    confirmPassword: string;
    otp: string;
    role?: 'user' | 'recruiter';
    entityType?: 'company' | 'institution' | 'startup';
  }) => Promise<UserProfile>;

  emailSignup: (data: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    otp: string;
  }) => Promise<UserProfile>;

  logout: () => Promise<void>;
  refresh: () => Promise<UserProfile | null>;
  fetchCurrentUser: (force?: boolean) => Promise<UserProfile | null>;
  checkAuth: (force?: boolean) => Promise<UserProfile | null>; // Deduplicated session check
  completeOnboarding: () => Promise<UserProfile | null>;
  clearError: () => void;
}

let authCheckPromise: Promise<UserProfile | null> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  isLoading: true,
  isInitialized: false,
  error: null,

  fetchCurrentUser: async (force: boolean = false) => {
    // If already checked and not forced, return cached user without duplicate network call
    if (!force && get().isInitialized) {
      return get().user;
    }

    if (authCheckPromise) {
      return authCheckPromise;
    }

    set({ loading: true, isLoading: true, error: null });
    authCheckPromise = (async () => {
      try {
        const user = await AuthService.fetchCurrentUser();
        set({ user, isAuthenticated: true, loading: false, isLoading: false, isInitialized: true });
        return user;
      } catch {
        set({ user: null, isAuthenticated: false, loading: false, isLoading: false, isInitialized: true });
        return null;
      } finally {
        authCheckPromise = null;
      }
    })();

    return authCheckPromise;
  },

  checkAuth: async (force: boolean = false) => {
    return get().fetchCurrentUser(force);
  },

  login: async (credentials) => {
    set({ loading: true, isLoading: true, error: null });
    try {
      const user = await AuthService.login(credentials);
      set({ user, isAuthenticated: true, loading: false, isLoading: false, isInitialized: true });
      return user;
    } catch (err: unknown) {
      const errorMsg =
        (err as { error?: { message?: string } })?.error?.message ||
        (err as { message?: string })?.message ||
        'Login failed';
      set({ error: errorMsg, loading: false, isLoading: false });
      throw new Error(errorMsg);
    }
  },

  googleLogin: async (credential: string) => {
    set({ loading: true, isLoading: true, error: null });
    try {
      const user = await AuthService.googleLogin(credential);
      set({ user, isAuthenticated: true, loading: false, isLoading: false, isInitialized: true });
      return user;
    } catch (err: unknown) {
      const errorMsg =
        (err as { error?: { message?: string } })?.error?.message ||
        (err as { message?: string })?.message ||
        'Google authentication failed';
      set({ error: errorMsg, loading: false, isLoading: false });
      throw new Error(errorMsg);
    }
  },

  sendEmailOtp: async (email: string) => {
    set({ error: null });
    try {
      return await AuthService.sendEmailOtp(email);
    } catch (err: unknown) {
      const errorMsg =
        (err as { error?: { message?: string } })?.error?.message ||
        (err as { message?: string })?.message ||
        'Failed to send Email OTP';
      set({ error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  verifyEmailOtp: async (data) => {
    set({ loading: true, isLoading: true, error: null });
    try {
      const user = await AuthService.verifyEmailOtp(data);
      set({ user, isAuthenticated: true, loading: false, isLoading: false, isInitialized: true });
      return user;
    } catch (err: unknown) {
      const errorMsg =
        (err as { error?: { message?: string } })?.error?.message ||
        (err as { message?: string })?.message ||
        'Email OTP verification failed';
      set({ error: errorMsg, loading: false, isLoading: false });
      throw new Error(errorMsg);
    }
  },

  sendOtp: async (email: string) => {
    return get().sendEmailOtp(email);
  },

  verifyOtp: async (data) => {
    return get().verifyEmailOtp(data);
  },

  sendWhatsAppOtp: async (data) => {
    set({ error: null });
    try {
      return await AuthService.sendWhatsAppOtp(data);
    } catch (err: unknown) {
      const errorMsg =
        (err as { error?: { message?: string } })?.error?.message ||
        (err as { message?: string })?.message ||
        'Failed to send WhatsApp OTP';
      set({ error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  verifyWhatsAppOtp: async (data) => {
    set({ loading: true, isLoading: true, error: null });
    try {
      const user = await AuthService.verifyWhatsAppOtp(data);
      set({ user, isAuthenticated: true, loading: false, isLoading: false, isInitialized: true });
      return user;
    } catch (err: unknown) {
      const errorMsg =
        (err as { error?: { message?: string } })?.error?.message ||
        (err as { message?: string })?.message ||
        'WhatsApp OTP verification failed';
      set({ error: errorMsg, loading: false, isLoading: false });
      throw new Error(errorMsg);
    }
  },

  emailSignup: async (data) => {
    return get().verifyEmailOtp(data);
  },

  refresh: async () => {
    try {
      const user = await AuthService.refresh();
      set({ user, isAuthenticated: true, loading: false, isLoading: false, isInitialized: true });
      return user;
    } catch {
      set({ user: null, isAuthenticated: false, loading: false, isLoading: false, isInitialized: true });
      return null;
    }
  },

  logout: async () => {
    set({ loading: true, isLoading: true });
    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({ user: null, isAuthenticated: false, loading: false, isLoading: false, isInitialized: true });
    }
  },

  completeOnboarding: async () => {
    try {
      const updatedUser = await AuthService.completeOnboarding();
      const mergedUser = { ...(get().user || {}), ...updatedUser, hasBuiltResume: true };
      set({ user: mergedUser as UserProfile });
      return mergedUser as UserProfile;
    } catch (err) {
      console.warn('Failed updating completeOnboarding in backend:', err);
      const currentUser = get().user;
      if (currentUser) {
        const optimistic = { ...currentUser, hasBuiltResume: true };
        set({ user: optimistic });
        return optimistic;
      }
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
