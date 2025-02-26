const Validation = {
    //WILL RETURN TRUE IF THERE ARE NO ERRORS

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
    }
}

export default Validation;