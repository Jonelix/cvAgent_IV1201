class Validation {
    //WILL RETURN TRUE IF THERE ARE NO ERRORS

    //Name validation
    static validateName(name) {
        return /^[A-Za-z]{2,255}$/.test(name);
    }

    static validateUsername(username) {
        return /^[A-Za-z0-9]{6,255}$/.test(username);
    }

    //Password validation
    static validatePassword(password) {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@$%^&*+#])[A-Za-z\d!@$%^&*+#]{6,255}$/.test(password);
    }

    //PNR validation
    static validatePNR(pnr) {
        return /^\d{12}$/.test(pnr);
    }

    //Email validation
    static validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
}

module.exports = Validation;