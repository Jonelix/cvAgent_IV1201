import { makeAutoObservable } from "mobx";

class ApplicantsModel {
    applicants = [];

    constructor() {
        makeAutoObservable(this);
    }

    setApplicantList(applicantList) {
        this.applicants = applicantList;
    }
}

export default ApplicantsModel;