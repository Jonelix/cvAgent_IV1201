/**
 * @fileoverview Validation module for various input fields.
 * This module provides functions to validate names, usernames, passwords, 
 * PNR numbers, emails, IDs, and arrays.
 */

const Validation = {
   
    /**
     * Validates a name.
     * Allows letters, spaces, and hyphens.
     * @param {string} name - The name to validate.
     * @returns {boolean} True if the name is valid, false otherwise.
     */
    validateName(name) {
        if (!name) {
            return false;
        }
        return /^[A-Za-z\s'-]{2,255}$/.test(name);
    },

    /**
     * Validates a username.
     * Allows alphanumeric characters and must be at least 6 characters long.
     * @param {string} username - The username to validate.
     * @returns {boolean} True if the username is valid, false otherwise.
     */
    validateUsername(username) {
        if (!username) {
            return false;
        }
        return /^[A-Za-z0-9]{6,255}$/.test(username);
    },

    /**
     * Validates a password.
     * Requires at least one uppercase letter, one number, and one special character.
     * @param {string} password - The password to validate.
     * @returns {boolean} True if the password is valid, false otherwise.
     */
    validatePassword(password) {
        if (!password) {
            return false;
        }
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@$%^&*+#])[A-Za-z\d!@$%^&*+#]{6,255}$/.test(password);
    },

    /**
     * Validates a PNR (Passenger Name Record) number.
     * Must be exactly 12 digits long.
     * @param {string} pnr - The PNR to validate.
     * @returns {boolean} True if the PNR is valid, false otherwise.
     */
    validatePNR(pnr) {
        if (!pnr) {
            return false;
        }
        return /^\d{12}$/.test(pnr);
    },

    /**
     * Validates an email address.
     * Must follow standard email format.
     * @param {string} email - The email to validate.
     * @returns {boolean} True if the email is valid, false otherwise.
     */
    validateEmail(email) {
        if (!email) {
            return false;
        }
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },

    /**
     * Validates an ID.
     * Must be a numeric value.
     * @param {string|number} id - The ID to validate.
     * @returns {boolean} True if the ID is valid, false otherwise.
     */
    validateID(id) {
        if (!id) {
            return false;
        }
        return /^\d+$/.test(id);
    },

   /**
     * Validates an array.
     * Ensures the input is a non-empty array.
     * @param {Array} arr - The array to validate.
     * @returns {boolean} True if the input is a valid non-empty array, false otherwise.
     */
    validateArray(arr) {
        return Array.isArray(arr) && arr.length > 0;
    }
    

    /*
    /**
     * Validates a cookie (Commented out).
     * Must be exactly 64 alphanumeric characters.
     * @param {string} cookie - The cookie to validate.
     * @returns {boolean} True if the cookie is valid, false otherwise.
     
    validateCookie(cookie) {
        if (!cookie) {
            return false;
        }
        return /^[A-Za-z0-9]{64}$/.test(cookie);
    }
    */
}

module.exports = Validation;
