class Validation {
    static validateEmail(email) {
        return email.includes('@');
    }
}

module.exports = Validation;