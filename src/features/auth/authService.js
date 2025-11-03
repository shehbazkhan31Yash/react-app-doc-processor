// src/features/auth/authService.js

export const AuthService = {
  login: async ({ email, password }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get all registered users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Find user with matching email
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error("User not found. Please register first.");
    }

    // Check if password matches
    if (user.password !== password) {
      throw new Error("Invalid password");
    }

    // Return user without password for security
    return {
      email: user.email,
      name: user.name,
    };
  },

  register: async ({ email, password }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error("Email already registered. Please login.");
    }

    // Create new user
    const newUser = {
      email,
      password,
      name: email.split('@')[0], // Extract name from email
    };

    // Save to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Return user without password
    return {
      email: newUser.email,
      name: newUser.name,
    };
  },

  logout: async () => {
    // Clear user session (optional)
    return true;
  },
};
