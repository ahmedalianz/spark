export const validateName = (
  name: string,
  fieldName: string = "Name"
): string | undefined => {
  validatePoliteWords(name, fieldName);
  if (!name.trim()) {
    return `${fieldName} is required`;
  }

  if (name.length < 2) {
    return `${fieldName} must be at least 2 characters`;
  }

  if (name.length > 50) {
    return `${fieldName} must be less than 50 characters`;
  }

  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!nameRegex.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
};

export const validateBio = (
  bio: string,
  maxLength: number = 150
): string | undefined => {
  validatePoliteWords(bio, "Bio");
  if (bio.length > maxLength) {
    return `Bio must be less than ${maxLength} characters`;
  }
};

export const validateEmail = (email: string): string | undefined => {
  validatePoliteWords(email, "Email");
  if (!email.trim()) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  if (email.length > 254) {
    return "Email is too long";
  }
};

export const validatePassword = (password: string): string | undefined => {
  validatePoliteWords(password, "Password");

  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (password.length > 128) {
    return "Password is too long";
  }

  // Check for at least one lowercase letter
  if (!/(?=.*[a-z])/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  return undefined;
};
export const validateConfirmPassword = (
  password: string,
  passwordConfirm: string
): string | undefined => {
  validatePoliteWords(password, "Password");

  if (!password) {
    return "Password Confirmation is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (password.length > 128) {
    return "Password is too long";
  }
  if (password !== passwordConfirm) {
    return "Passwords do not match";
  }
  // Check for at least one lowercase letter
  if (!/(?=.*[a-z])/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  return undefined;
};

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

export const validatePoliteWords = (
  text: string,
  fieldName?: string
): string | undefined => {
  const inappropriateWords = [
    "shit",
    "fuck",
    "bitch",
    "ass",
    "dick",
    "cock",
    "pussy",
    "asshole",
    "bastard",
    "slut",
    "whore",
    "porn",
    "pornhub",
    "pornhub",
  ];

  const lowerCaseBio = text.toLowerCase();
  for (const word of inappropriateWords) {
    if (lowerCaseBio.includes(word)) {
      return `${fieldName} contains inappropriate content`;
    }
  }
};
export default {
  validateName,
  validateBio,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  sanitizeInput,
};
