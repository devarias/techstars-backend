# Mentor Matching Machine API application.
<p align="center">
  <img src="https://i.imgur.com/ESxEEg3.png">
</p>

This README provides guidelines for Mentor Matching Machine API, used to receive and send data to the web application [Mentor Matching Machine](www.mentorai.co).

# Content
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running](#running)
- [Routes and Methods](#routes-and-methods)
  - [Mentor Routes](#mentor-routes)
  - [Company Routes](#company-routes)
  - [Mentor Surveys Routes](#mentor-surveys-routes)
  - [Company Surveys Routes](#company-surveys-routes)
  - [Meetings Routes](#meetings-routes)
  - [Pending Route](#pending-route)
  - [Performance Routes](#performance-routes)
  - [Reminder Routes](#reminder-routes)
  - [Results Routes](#results-routes)
  - [Schedule Routes](#schedule-routes)
  - [Reschedule Routes](#reschedule-routes)
  - [Table Route](#table-route)
- [Status Codes](#status-codes)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Contributors](#contributors)

# Getting Started

This project was built to communicate the front-end of the web application with the back-end running in this app as a RESTful API. As the first step is to receive a CSV with a specific format, this file must contain the information about the mentors, companies, the availability of the mentors to be scheduled during a week. The app analyzes the file and save all the distributed meetings in the database with all the information about the mentors and companies.
<br />
To implement this RESTful API you have to follow some instructions and requirements to use it.

# Prerequisites

* `nodejs` => v10.19.0
* `npm` => v6.14.4
* All the `const` variables with a **url address** must be changed to `http://localhost:5000`

# Installation

* `git clone https://github.com/devarias/techstars-backend.git`
* `cd techstars-backend`
* `./dependencies.sh` => In this file you'll find all the node package modules to install.
* Everything is installed and ready to run.

# Running

* `npm run dev`
  * This command will start running the API as a development environment, to apply changes during the modification of the files.
* `npm start`
  * This command will start running the API as a production environment, if you want to do a change, they will not be applied to the running app.

# Routes and Methods

* ## Mentor Routes

| Route          |  Method  | Description                             |
| -------------- | :------: | --------------------------------------- |
| `api/mentors`     |  `get`   | To get all the data of the mentors      |
| `api/mentors`     |  `post`  | To create a new mentor                  |
| `api/mentors`     | `delete` | To delete an existing mentor            |
| `api/mentors/:id` |  `get`   | To get the data about a specific mentor |
| `api/mentors/:id` |  `put`   | To update an existing mentor            |
<br />

* ## Company Routes

| Route            |  Method  | Description                              |
| ---------------- | :------: | ---------------------------------------- |
| `api/companies`     |  `get`   | To get all the data of the companies     |
| `api/companies/:id` |  `get`   | To get the data about a specific company |
| `api/companies/:id` | `delete` | To delete an existing company            |
| `api/companies/:id` |  `put`   | To update an existing company            |
<br />

* ## Mentor Surveys Routes

| Route                       |  Method  | Description                                          |
| --------------------------- | :------: | ---------------------------------------------------- |
| `api/mentor_survey`            |  `get`   | To get all the data of the surveys filled by mentors |
| `api/mentor_survey`            |  `post`  | To create a new survey filled by a mentor            |
| `api/mentor_survey/:id`        |  `get`   | To get the data about a specific survey              |
| `api/mentor_survey/:id`        | `delete` | To delete an existing survey                         |
| `api/mentor_survey/:id`        |  `put`   | To update an existing survey                         |
| `api/mentor_survey/mentor/:id` |  `get`   | To get the data of a mentor with a specific survey   |
<br />

* ## Company Surveys Routes

| Route                        |  Method  | Description                                                          |
| ---------------------------- | :------: | -------------------------------------------------------------------- |
| `api/company_survey`            |  `get`   | To get all the data of the surveys filled by companies               |
| `api/company_survey`            |  `post`  | To create a new survey filled by a company                           |
| `api/company_survey/:id`        |  `get`   | To get the data about a specific survey                              |
| `api/company_survey/:id`        | `delete` | To delete an existing survey                                         |
| `api/company_survey/:id`        |  `put`   | To update an existing survey                                         |
| `api/company_survey/mentor/:id` |  `get`   | To get the data of a mentor with a specific survey filled by company |
<br />

* ## Meetings Routes

| Route       | Method | Description                         |
| ----------- | :----: | ----------------------------------- |
| `api/meetings` | `get`  | To get all the data of the meetings |
| `api/meetings` | `put`  | To update a meeting                 |
<br />

* ## Pending Route

| Route      | Method | Description                                                   |
| ---------- | :----: | ------------------------------------------------------------- |
| `api/pending` | `get`  | To get all the data about the pending mentors to be scheduled |
<br />

* ## Performance Routes

| Route                    | Method | Description                           |
| ------------------------ | :----: | ------------------------------------- |
| `api/performance/mentors`   | `get`  | To get the performance of the mentors |
| `api/performance/companies` | `get`  | To get the performance of the mentors |
<br />

* ## Reminder Routes

| Route                 | Method | Description                                                |
| --------------------- | :----: | ---------------------------------------------------------- |
| `api/reminder/mentors`   | `get`  | To send the reminders to fill the surveys to the mentors   |
| `api/reminder/companies` | `get`  | To send the reminders to fill the surveys to the companies |
<br />

* ## Results Routes

| Route                | Method | Description                                      |
| -------------------- | :----: | ------------------------------------------------ |
| `api/results/mentors`   | `get`  | To get all the results of the surveys by mentor  |
| `api/results/companies` | `get`  | To get all the results of the surveys by company |
<br />

* ## Schedule Routes

| Route       | Method | Description                                          |
| ----------- | :----: | ---------------------------------------------------- |
| `api/schedule` | `get`  | To get the data of the scheduled meetings            |
| `api/schedule` | `post` | To create the schedule for the mentors and companies |
<br />

* ## Reschedule Routes

| Route         | Method | Description                                     |
| ------------- | :----: | ----------------------------------------------- |
| `api/reschedule` | `post` | To reschedule a meeting                         |
| `api/reschedule` | `put`  | To create a new meeting for a mentor or company |
<br />

* ## Table Route

| Route    | Method | Description                                          |
| -------- | :----: | ---------------------------------------------------- |
| `api/table` | `get`  | To get the table of the meetings once are generated  |
<br />

# Status Codes

| HTTP Status Code |                                     Description                                     |
| :--------------: | :---------------------------------------------------------------------------------: |
|      `200`       |             Successfully response by a `get` method used in an endpoint             |
|      `201`       |            Successfully response by a `post` method used in an endpoint             |
|      `400`       | Response by a `get`, `post` or `put` method used in an endpoint with an specific id |
|      `404`       | Response by a `get`, `post` or `put` method used in an endpoint with an specific id |
|      `500`       |                     Response when the server is not responding                      |
<br />

# Deployment

* The deployment of this RESTful API was made in Heroku Platform to be tested.
  * https://techstars-api.herokuapp.com/api/

# Built With

  * NodeJS
  * PostgreSQL
  * Sequilize
  * ExpressJS
  * npm
  * Sendgrid

# Contributors

<div align='center'>
  <div>
    <table>
      <tr>
        <td valign="top" align='center'>
          <a href="https://github.com/Deyber2000" target="_blank">
            <p>Deyber Castaneda</p>
            <img alt="github_page" src="https://avatars.githubusercontent.com/u/65909950?v=4" height="80" width="80"/>
          </a>
          <br />
          <a href="https://www.linkedin.com/in/deybercastaneda/" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/plasticine/100/000000/linkedin.png" width="35" />
          </a>
          <a href="https://www.twitter.com/Deibercastaeda2" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/plasticine/100/000000/twitter.png" width="35" />
          </a>
        </td>
        <td valign="top" align='center'>
          <a href="https://github.com/Ana-Morales" target="_blank">
            <p>Ana Ruth Morales</p>
            <img alt="github_page" src="https://avatars.githubusercontent.com/u/66080450?v=4" height="80" width="80"/>
          </a>
          <br />
          <a href="https://www.linkedin.com/in/ana-ruth-morales/" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/plasticine/100/000000/linkedin.png" width="35" />
          </a>
          <a href="https://www.twitter.com/San_Mor_" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/plasticine/100/000000/twitter.png" width="35" />
          </a>
        </td>
        <td valign="top" align='center'>
          <a href="https://github.com/devarias" target="_blank">
            <p>David Arias Fuentes</p>
            <img alt="github_page" src="https://avatars.githubusercontent.com/u/61300552?v=4" height="80" width="80"/>
          </a>
          <br />
          <a href="https://www.linkedin.com/in/devarias/" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/plasticine/100/000000/linkedin.png" width="35" />
          </a>
          <a href="https://www.twitter.com/DavidDevArias" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/plasticine/100/000000/twitter.png" width="35" />
          </a>
        </td>
      </tr>
    </table>
  </div>
</div>
