import { create } from "zustand";

export interface UserPreferences {
  interests: string[];
  budget: number;
  travelStyle: string;
  homeCity: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    preferences: UserPreferences
  ) => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateProfile: (name: string, email: string) => void;
}

// Helper to get initial state from localStorage safely for SSR
const getLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
  }
  return null;
};

const setLocalStorage = (key: string, value: unknown) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Error writing localStorage", e);
    }
  }
};

const removeLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("Error removing localStorage", e);
    }
  }
};

export const useAuthStore = create<AuthState>((set) => {
  // Initialize state
  const initialUser = getLocalStorage("smartyatra_user");
  const initialToken = getLocalStorage("smartyatra_token");

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken,

    login: async (email: string, name?: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const defaultUser: User = {
        id: "usr_" + Math.random().toString(36).substr(2, 9),
        name: name || email.split("@")[0],
        email: email,
        preferences: {
          interests: ["Nature", "Food"],
          budget: 20000,
          travelStyle: "Standard",
          homeCity: "Mumbai",
        },
      };

      setLocalStorage("smartyatra_user", defaultUser);
      setLocalStorage("smartyatra_token", "mock-jwt-token-12345");

      set({
        user: defaultUser,
        token: "mock-jwt-token-12345",
        isAuthenticated: true,
      });
    },

    signup: async (name: string, email: string, preferences: UserPreferences) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newUser: User = {
        id: "usr_" + Math.random().toString(36).substr(2, 9),
        name,
        email,
        preferences,
      };

      setLocalStorage("smartyatra_user", newUser);
      setLocalStorage("smartyatra_token", "mock-jwt-token-12345");

      set({
        user: newUser,
        token: "mock-jwt-token-12345",
        isAuthenticated: true,
      });
    },

    logout: () => {
      removeLocalStorage("smartyatra_user");
      removeLocalStorage("smartyatra_token");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },

    updatePreferences: (prefs: Partial<UserPreferences>) => {
      set((state) => {
        if (!state.user) return {};
        const updatedUser = {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ...prefs,
          },
        };
        setLocalStorage("smartyatra_user", updatedUser);
        return { user: updatedUser };
      });
    },

    updateProfile: (name: string, email: string) => {
      set((state) => {
        if (!state.user) return {};
        const updatedUser = {
          ...state.user,
          name,
          email,
        };
        setLocalStorage("smartyatra_user", updatedUser);
        return { user: updatedUser };
      });
    },
  };
});
