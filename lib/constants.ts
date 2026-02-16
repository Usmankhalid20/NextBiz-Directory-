export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const COOKIE_NAME = 'token';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ADMIN_DASHBOARD: '/admin/dashboard',
  PENDING_ACCESS: '/pending-access',
} as const;

export const API_ROUTES = {
  AUTH_LOGIN: '/api/auth/login',
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_ME: '/api/auth/me',
  AUTH_LOGOUT: '/api/auth/logout',
  BUSINESSES: '/api/businesses',
  UPLOAD: '/api/upload',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden action',
  INTERNAL_ERROR: 'Internal server error',
  SUCCESS: 'Operation successful',
} as const;
