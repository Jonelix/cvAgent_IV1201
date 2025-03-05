/**
 * Validation Utility - Provides functions for validating user input fields.
 * Contains methods for name, username, password, personal number (PNR), and email validation.
 */
const Validation = {
    /**
     * Validates a name.
     * 
     * @param {string} name - The name to validate.
     * @returns {boolean} True if the name is valid, otherwise false.
     */
    validateName(name) {
        if (!name) {
            return false;
        }
        return /^[A-Za-z]{2,255}$/.test(name);
    },
    /**
     * Validates a username.
     * 
     * @param {string} username - The username to validate.
     * @returns {boolean} True if the username is valid, otherwise false.
     */
    validateUsername(username) {
        if (!username) {
            return false;
        }
        return /^[A-Za-z0-9]{6,255}$/.test(username);
    },

    /**
     * Validates a password.
     * 
     * @param {string} password - The password to validate.
     * @returns {boolean} True if the password meets the complexity requirements, otherwise false.
     */
    validatePassword(password) {
        if (!password) {
            return false;
        }
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@$%^&*+#])[A-Za-z\d!@$%^&*+#]{6,255}$/.test(password);
    },

    /**
     * Validates a personal number (PNR).
     * 
     * @param {string} pnr - The personal number to validate.
     * @returns {boolean} True if the PNR consists of 12 digits, otherwise false.
     */
    validatePNR(pnr) {
        if (!pnr) {
            return false;
        }
        return /^\d{12}$/.test(pnr);
    },

    /**
     * Validates an email address.
     * 
     * @param {string} email - The email address to validate.
     * @returns {boolean} True if the email format is valid, otherwise false.
     */
    validateEmail(email) {
        if (!email) {
            return false;
        }
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
}

export default Validation;