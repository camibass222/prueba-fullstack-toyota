export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}