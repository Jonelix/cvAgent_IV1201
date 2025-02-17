import { makeAutoObservable } from "mobx";

class ApplicantsModel {
    applicants = [];
    user = {}; // Store the logged-in user details

    constructor() {
        makeAutoObservable(this);
    }

    setApplicantList(applicantList) {
        this.applicants = applicantList;
    }

    setUser(user) {
        this.user = user; // Store user data
    }
}

export default ApplicantsModel;
