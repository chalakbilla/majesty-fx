import { adminCredentials } from '../data/adminData.js';

const ADMIN_STORAGE_KEY = 'majesty_admin_auth';

export function isAdminAuthenticated() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    return Boolean(session?.authenticated);
  } catch {
    return false;
  }
}

export function getAdminUser() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loginAdmin(emailOrUsername, password, desk = 'demo') {
  const identifier = (emailOrUsername || '').trim().toLowerCase();
  const pass = (password || '').trim();

  const user = adminCredentials.find(
    (u) =>
      (u.email.toLowerCase() === identifier || u.username.toLowerCase() === identifier) &&
      u.password === pass
  );

  if (user) {
    const session = {
      authenticated: true,
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      desk: desk || user.desk,
      portal: user.portal,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
    return { success: true, user: session };
  }

  return {
    success: false,
    error: 'Invalid administrator credentials. Access is monitored and logged.'
  };
}

export function logoutAdmin() {
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  } catch (e) {
    console.error('Error logging out admin:', e);
  }
}
