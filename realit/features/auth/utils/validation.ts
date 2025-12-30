/**
 * Validates a password against complexity requirements.
 * Requirements:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * - Minimum 8 characters length
 * 
 * @param password The password string to validate
 * @returns An object containing isValid boolean and an optional error message
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
    if (password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters long' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase) {
        return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }
    if (!hasLowerCase) {
        return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }
    if (!hasNumber) {
        return { isValid: false, error: 'Password must contain at least one number' };
    }
    if (!hasSpecialChar) {
        return { isValid: false, error: 'Password must contain at least one special character' };
    }

    return { isValid: true };
};

/**
 * Checks if two passwords match.
 * 
 * @param password The main password
 * @param confirmPassword The confirmation password
 * @returns True if passwords match, false otherwise
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
};
