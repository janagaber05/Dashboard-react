// Simple authentication utility using localStorage
const AUTH_KEY = 'dashboard_auth';

export const auth = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  },

  // Set authentication status
  login: (rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem(AUTH_KEY, 'true');
    } else {
      sessionStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(AUTH_KEY, 'true');
    }
  },

  // Clear authentication status
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  }
};

