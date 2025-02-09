# Group 16 - First Report

This report details the approach group 16 has taken to take decisions and complete the project proposed by the course. 

## Desicion making
For this project we will be operating through single [GitHub repository](https://github.com/Jonelix/cvAgent_IV1201) where we document our desicions and develop our software. Throughout our report we will explain some of the decisions we make, why we make them and which grading criteria it corresponds to. Grading criteria will be marked as "[1]" for grading criteria 1.

## Project architecture
This consists of making a software platform where *applicants* can submit their CV and *recruiters* can review those applications. For this first cycle of the development process we have to decide which tools and resources we will use to design, develop and maintain the software.

After reviewing the application description provided by the company we have decided that and initial Monolith architecture with client-side rendering. We chose this architecture since the product will then be able to support horizontal scaling and can in the future easily be transformed into a Microlith architecture supporting mobile devices. This way we can develop the frontend for the web client and mobile client in a modular way, but they can both rely on the same backend to provide critical functional information.

