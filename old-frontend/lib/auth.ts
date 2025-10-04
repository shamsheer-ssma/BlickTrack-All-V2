// Authentication and User Session Management
import { AuthUser } from './auth-service';

export interface User extends AuthUser {
  company?: string; // Legacy field for backward compatibility
  passwordHash?: string; // Only for server-side storage
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// In-memory user storage (in production, use proper database)
const userStore = new Map<string, User>();

// Server-side user storage (persists across server restarts)
declare global {
  var __blickUsers: Map<string, User> | undefined;
}

if (!global.__blickUsers) {
  global.__blickUsers = new Map<string, User>();
}

const serverUserStore = global.__blickUsers;

// Current logged-in user (in production, use proper session management)
let currentUser: User | null = null;

// Initialize with some sample users for testing
// Note: In production, these passwords should be properly hashed during user creation
const sampleUsers: User[] = [
  {
    id: 'user_1',
    firstName: 'Syed',
    lastName: 'Shamsheer',
    email: 'syed.shamsheer.os@gmail.com',
    role: 'Platform Admin',
    tenant: 'BlickTrack Platform',
    company: 'BlickTrack Inc.',
    organization: 'BlickTrack Inc.',
    userType: 'Licensed User',
    isLicensed: true,
    emailVerified: true,
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5qF5z8QvIu', // password: admin123
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'user_2',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@blicktrack.com',
    role: 'Platform Admin',
    tenant: 'BlickTrack Platform',
    company: 'BlickTrack Inc.',
    organization: 'BlickTrack Inc.',
    userType: 'Licensed User',
    isLicensed: true,
    emailVerified: true,
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5qF5z8QvIu', // password: admin123
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'user_3',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@blicktrack.com',
    role: 'Platform Admin',
    tenant: 'BlickTrack Platform',
    company: 'BlickTrack Inc.',
    organization: 'BlickTrack Inc.',
    userType: 'Licensed User',
    isLicensed: true,
    emailVerified: true,
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5qF5z8QvIu', // password: admin123
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'user_4',
    firstName: 'Syed',
    lastName: 'Shamsheer',
    email: 'syed.shamsheer.ma@gmail.com',
    role: 'Trial User',
    tenant: 'Trial Users',
    company: 'Beoing',
    organization: 'Beoing',
    userType: 'Trial User',
    isLicensed: false,
    emailVerified: true,
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5qF5z8QvIu', // password: admin123
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Initialize sample users in both stores
sampleUsers.forEach(user => {
  userStore.set(user.email, user);
  serverUserStore.set(user.email, user);
});

// Load users from localStorage on initialization (client-side only)
if (typeof window !== 'undefined') {
  try {
    const storedUsers = localStorage.getItem('blick_users');
    if (storedUsers) {
      const users: User[] = JSON.parse(storedUsers);
      users.forEach(user => {
        userStore.set(user.email, user);
      });
      console.log(`Loaded ${users.length} users from localStorage`);
    }
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
  }
}

/**
 * Store user data after successful signup
 */
export function storeUser(user: User, token?: string): void {
  console.log(`storeUser: Storing user ${user.email} with passwordHash: ${!!user.passwordHash}`);
  userStore.set(user.email, user);
  serverUserStore.set(user.email, user); // Store on server-side too
  console.log(`storeUser: Server store now has ${serverUserStore.size} users`);
  currentUser = user;
  
  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('blick_user', JSON.stringify(user));
    
    // Store JWT token if provided
    if (token) {
      localStorage.setItem('blick_token', token);
    }
    
    // Also store in the users collection
    const storedUsers = localStorage.getItem('blick_users');
    let users: User[] = [];
    
    if (storedUsers) {
      try {
        users = JSON.parse(storedUsers);
      } catch (error) {
        console.error('Error parsing stored users:', error);
        users = [];
      }
    }
    
    // Add or update user in the collection
    const existingIndex = users.findIndex(u => u.email === user.email);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem('blick_users', JSON.stringify(users));
    console.log(`User stored in collection: ${user.firstName} ${user.lastName} (${user.email})`);
  }
  
  console.log(`User stored: ${user.firstName} ${user.lastName} (${user.email})`);
}

/**
 * Get current logged-in user
 */
export function getCurrentUser(): User | null {
  console.log('🔍 getCurrentUser: Checking for current user...');
  
  // Try to get from memory first
  if (currentUser) {
    console.log('✅ getCurrentUser: Found user in memory:', currentUser.email);
    return currentUser;
  }
  
  // Try to get from localStorage
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('blick_user');
    console.log('🔍 getCurrentUser: localStorage blick_user:', storedUser ? 'Found' : 'Not found');
    
    if (storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
        console.log('✅ getCurrentUser: Parsed user from localStorage:', currentUser?.email);
        return currentUser;
      } catch (error) {
        console.error('❌ getCurrentUser: Error parsing stored user:', error);
        localStorage.removeItem('blick_user');
      }
    }
  }
  
  console.log('❌ getCurrentUser: No user found');
  return null;
}

/**
 * Login user by email (simulate login process)
 */
export function loginUser(email: string): User | null {
  console.log(`loginUser called with email: ${email}`);
  
  // Try client-side store first
  let user = userStore.get(email);
  console.log(`Client store result:`, user ? 'User found' : 'User not found');
  
  // If not found in client store, try server store
  if (!user) {
    user = serverUserStore.get(email);
    console.log(`Server store result:`, user ? 'User found' : 'User not found');
    if (user) {
      // Sync to client store
      userStore.set(email, user);
    }
  }
  
  if (user) {
    currentUser = user;
    console.log(`Setting currentUser to: ${user.firstName} ${user.lastName}`);
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('blick_user', JSON.stringify(user));
      console.log(`Stored user in localStorage`);
    }
    
    console.log(`User logged in: ${user.firstName} ${user.lastName} (${user.email})`);
    return user;
  }
  
  console.log(`User not found for email: ${email}`);
  return null;
}

/**
 * Logout current user
 */
export async function logoutUser(): Promise<void> {
  try {
    // Call logout API to clear server-side session
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Error calling logout API:', error);
  }

  currentUser = null;
  
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('blick_user');
    localStorage.removeItem('blick_token');
  }
  
  console.log('User logged out');
}

/**
 * Get stored JWT token
 */
export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('blick_token');
  }
  return null;
}

/**
 * Set JWT token
 */
export function setStoredToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('blick_token', token);
  }
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

/**
 * Get user info for header display
 */
export function getUserInfoForHeader(): {
  name: string;
  email: string;
  role: string;
  tenant?: string;
  company?: string;
} | null {
  const user = getCurrentUser();
  if (!user) return null;
  
  return {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    tenant: user.tenant,
    company: user.organization
  };
}

/**
 * Get user from server store (for API routes)
 */
export function getUserFromServer(email: string): User | null {
  const user = serverUserStore.get(email);
  console.log(`getUserFromServer(${email}):`, user ? 'User found' : 'User not found');
  if (user) {
    console.log(`User details: ${user.firstName} ${user.lastName}, hasPasswordHash: ${!!user.passwordHash}`);
  }
  
  // Debug: List all users in server store
  console.log(`Server store contains ${serverUserStore.size} users:`);
  serverUserStore.forEach((u, email) => {
    console.log(`  - ${email}: ${u.firstName} ${u.lastName} (hasPasswordHash: ${!!u.passwordHash})`);
  });
  
  return user || null;
}
