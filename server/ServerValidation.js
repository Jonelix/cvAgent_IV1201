const Validation = {
    // Name validation (Allows letters, spaces, and hyphens)
    //Name validation
    validateName(name) {
        if (!name) {
            return false;
        }
        return /^[A-Za-z]{2,255}$/.test(name);
    },

    validateUsername(username) {
        if (!username) {
            return false;
        }
        return /^[A-Za-z0-9]{6,255}$/.test(username);
    },

    //Password validation
    validatePassword(password) {
        if (!password) {
            return false;
        }
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@$%^&*+#])[A-Za-z\d!@$%^&*+#]{6,255}$/.test(password);
    },

    //PNR validation
    validatePNR(pnr) {
        if (!pnr) {
            return false;
        }
        return /^\d{12}$/.test(pnr);
    },

    //Email validation
    validateEmail(email) {
        if (!email) {
            return false;
        }
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },

    // ID validation (Generic for IDs)
    validateID(id) {
        if (!id) {
            return false;
        }
        return /^\d+$/.test(id);
    },

    // Array validation (Checks if input is a non-empty array)
    validateArray(arr) {
        return Array.isArray(arr) && arr.length > 0;
    }
}

module.exports = Validation;
