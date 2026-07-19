/**
 * Demo-only auth backed by localStorage, as specified in the brief.
 * This is intentionally NOT secure (no hashing, no server) — it exists
 * to make the Dashboard/Editor flow feel real, not to gate real data.
 */
const USERS_KEY = 'vectorflow.users.v1';
const SESSION_KEY = 'vectorflow.session.v1';

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) ?? [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register({ name, email, password }) {
  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error('An account with that email already exists.');
  }
  const user = { id: crypto.randomUUID(), name, email, password };
  writeUsers([...users, user]);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, name, email }));
  return { id: user.id, name, email };
}

export function login({ email, password }) {
  const users = readUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password.');
  const session = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}
