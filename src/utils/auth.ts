export interface User {
  username: string;
  email: string;
  phone?: string;
  password: string;
  role?: 'buyer' | 'seller' | 'admin';
}

const USERS_KEY = 'marketplace_users';
const CURRENT_KEY = 'marketplace_current_user';

const readUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Ensure a default admin exists for management tasks
(() => {
  try {
    const users = readUsers();
    if (!users.find((u) => u.role === 'admin')) {
      // create the Nova Mart admin account
      users.push({ username: 'admin', email: 'admin@novamart.com', password: 'NovaMart@12', role: 'admin' });
      writeUsers(users);
    }
  } catch {
    // ignore
  }
})();

export const auth = {
  register: (user: User) => {
    const users = readUsers();
    const conflicting = users.find((u) =>
      u.username === user.username ||
      u.email === user.email ||
      (user.phone && u.phone === user.phone)
    );
    if (conflicting) {
      throw new Error('A user already exists with that username, email, or phone number.');
    }
    if (!user.phone || !user.phone.trim()) {
      throw new Error('Phone number is required to register.');
    }
    const toSave: User = { ...user, role: user.role || 'buyer' };
    users.push(toSave);
    writeUsers(users);
    localStorage.setItem(
      CURRENT_KEY,
      JSON.stringify({ username: toSave.username, email: toSave.email, phone: toSave.phone, role: toSave.role })
    );
    return { username: toSave.username, email: toSave.email, role: toSave.role };
  },
  login: (identifier: string, password: string) => {
    const users = readUsers();
    const user = users.find(
      (u) =>
        (u.username === identifier || u.email === identifier || u.phone === identifier) &&
        u.password === password
    );
    if (!user) throw new Error('Invalid credentials');
    localStorage.setItem(
      CURRENT_KEY,
      JSON.stringify({ username: user.username, email: user.email, phone: user.phone, role: user.role })
    );
    return { username: user.username, email: user.email, role: user.role };
  },
  logout: () => {
    localStorage.removeItem(CURRENT_KEY);
  },
  current: () => {
    try {
      const raw = localStorage.getItem(CURRENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  forgotPassword: (identifier: string, newPassword: string) => {
    const users = readUsers();
    const account = users.find(
      (u) => u.username === identifier || u.email === identifier || u.phone === identifier
    );
    if (!account) throw new Error('No account found for that identifier.');
    account.password = newPassword;
    writeUsers(users);
    return true;
  },
  listUsers: () => readUsers()
};
