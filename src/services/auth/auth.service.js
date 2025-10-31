export { login } from "./login";
export { logout } from "./logout";
export { register } from "./register";

// Auth helpers migrated from shared/utils/auth.js
export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function setUser(user) {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (_) {
    // ignore
  }
}

export function getUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function hasRole(role) {
  const user = getUser();
  if (!user) return false;
  const roles = Array.isArray(user.roles) ? user.roles : [user.role || user.roles].filter(Boolean);
  return roles.includes(role);
}
