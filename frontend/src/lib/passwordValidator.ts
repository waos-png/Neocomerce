// frontend/src/lib/passwordValidator.ts
export interface PasswordValidation {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export function validatePassword(password: string): PasswordValidation {
  return {
    isValid: false, // se calcula al final
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
  };
}

export function isPasswordValid(password: string): boolean {
  const v = validatePassword(password);
  return v.hasMinLength && v.hasUppercase && v.hasLowercase && v.hasNumber && v.hasSpecialChar;
}