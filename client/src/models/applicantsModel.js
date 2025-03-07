import { makeAutoObservable } from "mobx";

/**
 * ApplicantsModel - Manages the state of applicants and user data using MobX.
 * 
 * - Stores a list of applicants.
 * - Stores the logged-in user details.
 * - Provides methods to update the applicant list and user data.
 */
class ApplicantsModel {
    /**
     * @property {Array} applicants - List of applicants.
     */
    applicants = [];

    /**
     * @property {Object} user - The currently logged-in user details.
     */
    user = {}; 

    /**
     * Constructor initializes the store with MobX auto-observable behavior.
     */
    constructor() {
        makeAutoObservable(this);
    }

    /**
     * Updates the applicant list.
     * 
     * @param {Array} applicantList - The new list of applicants.
     */
    setApplicantList(applicantList) {
        this.applicants = applicantList;
    }

    /**
     * Sets the user data.
     * 
     * @param {Object} user - The user details to store.
     */
    setUser(user) {
        this.user = user; 
}
}

export default ApplicantsModel;
