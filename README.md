# Mentor Matching Machine API application.
<p align="center">
  <img src="https://i.imgur.com/ESxEEg3.png">
</p>

This README provides guidelines and examples for Mentor Matching Machine API, used to receive and send data to the web application [Mentor Matching Machine](www.mentorai.co).

# Content
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
- [Contributors](#contributors)


# Routes and Methods
<br />

* ## Mentor Routes

| Route          |  Method  | Description                             |
| -------------- | :------: | --------------------------------------- |
| `/mentors`     |  `get`   | To get all the data of the mentors      |
| `/mentors`     |  `post`  | To create a new mentor                  |
| `/mentors`     | `delete` | To delete an existing mentor            |
| `/mentors/:id` |  `get`   | To get the data about a specific mentor |
| `/mentors/:id` |  `put`   | To update an existing mentor            |
<br />

* ## Company Routes

| Route            |  Method  | Description                              |
| ---------------- | :------: | ---------------------------------------- |
| `/companies`     |  `get`   | To get all the data of the companies     |
| `/companies/:id` |  `get`   | To get the data about a specific company |
| `/companies/:id` | `delete` | To delete an existing company            |
| `/companies/:id` |  `put`   | To update an existing company            |
<br />

* ## Mentor Surveys Routes

| Route                       |  Method  | Description                                          |
| --------------------------- | :------: | ---------------------------------------------------- |
| `/mentor_survey`            |  `get`   | To get all the data of the surveys filled by mentors |
| `/mentor_survey`            |  `post`  | To create a new survey filled by a mentor            |
| `/mentor_survey/:id`        |  `get`   | To get the data about a specific survey              |
| `/mentor_survey/:id`        | `delete` | To delete an existing survey                         |
| `/mentor_survey/:id`        |  `put`   | To update an existing survey                         |
| `/mentor_survey/mentor/:id` |  `get`   | To get the data of a mentor with a specific survey   |
<br />

* ## Company Surveys Routes

| Route                        |  Method  | Description                                                          |
| ---------------------------- | :------: | -------------------------------------------------------------------- |
| `/company_survey`            |  `get`   | To get all the data of the surveys filled by companies               |
| `/company_survey`            |  `post`  | To create a new survey filled by a company                           |
| `/company_survey/:id`        |  `get`   | To get the data about a specific survey                              |
| `/company_survey/:id`        | `delete` | To delete an existing survey                                         |
| `/company_survey/:id`        |  `put`   | To update an existing survey                                         |
| `/company_survey/mentor/:id` |  `get`   | To get the data of a mentor with a specific survey filled by company |
<br />

* ## Meetings Routes

| Route       | Method | Description                         |
| ----------- | :----: | ----------------------------------- |
| `/meetings` | `get`  | To get all the data of the meetings |
| `/meetings` | `put`  | To update a meeting                 |
<br />

* ## Pending Route

| Route      | Method | Description                                                   |
| ---------- | :----: | ------------------------------------------------------------- |
| `/pending` | `get`  | To get all the data about the pending mentors to be scheduled |
<br />

* ## Performance Routes

| Route                    | Method | Description                           |
| ------------------------ | :----: | ------------------------------------- |
| `/performance/mentors`   | `get`  | To get the performance of the mentors |
| `/performance/companies` | `get`  | To get the performance of the mentors |
<br />

* ## Reminder Routes

| Route                 | Method | Description                                                |
| --------------------- | :----: | ---------------------------------------------------------- |
| `/reminder/mentors`   | `get`  | To send the reminders to fill the surveys to the mentors   |
| `/reminder/companies` | `get`  | To send the reminders to fill the surveys to the companies |
<br />

* ## Results Routes

| Route                | Method | Description                                      |
| -------------------- | :----: | ------------------------------------------------ |
| `/results/mentors`   | `get`  | To get all the results of the surveys by mentor  |
| `/results/companies` | `get`  | To get all the results of the surveys by company |
<br />

* ## Schedule Routes

| Route       | Method | Description                                          |
| ----------- | :----: | ---------------------------------------------------- |
| `/schedule` | `get`  | To get the data of the scheduled meetings            |
| `/schedule` | `post` | To create the schedule for the mentors and companies |
<br />

* ## Reschedule Routes

| Route         | Method | Description                                     |
| ------------- | :----: | ----------------------------------------------- |
| `/reschedule` | `post` | To reschedule a meeting                         |
| `/reschedule` | `put`  | To create a new meeting for a mentor or company |
<br />

* ## Table Route

| Route    | Method | Description                                          |
| -------- | :----: | ---------------------------------------------------- |
| `/table` | `get`  | To get the table of the meetings once are generated  |
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

# Contributors


<div style="display: flex; align-items: center; margin-left: 10%;">
  <div align='center' style="margin-right: 10%;">
    <a href="https://github.com/Deyber2000" target="_blank">
      <img alt="twitter_page" src="https://avatars.githubusercontent.com/u/65909950?v=4" height="80" width="80">
    <p>Deyber Castaneda</p>
    </a>
    <a href="https://www.linkedin.com/in/deybercastaneda/" target="_blank" rel="noopener noreferrer">
      <img src="https://img.icons8.com/plasticine/100/000000/linkedin.png" width="35" />
    </a>
    <a href="https://www.twitter.com/Deibercastaeda2" target="_blank" rel="noopener noreferrer">
      <img src="https://img.icons8.com/plasticine/100/000000/twitter.png" width="35" />
    </a>
  </div>
  <div align='center' style="margin-right: 10%;">
    <a href="https://github.com/Ana-Morales" target="_blank">
      <img alt="twitter_page" src="https://avatars.githubusercontent.com/u/66080450?v=4" height="80" width="80">
      <p>Ana Ruth Morales</p>
    </a>
    <div>
    <a href="https://www.linkedin.com/in/ana-ruth-morales/" target="_blank" rel="noopener noreferrer">
      <img src="https://img.icons8.com/plasticine/100/000000/linkedin.png" width="35" />
    </a>
    <a href="https://www.twitter.com/San_Mor_" target="_blank" rel="noopener noreferrer">
      <img src="https://img.icons8.com/plasticine/100/000000/twitter.png" width="35" />
    </a>
  </div>
</div>
  <div align='center' style="margin-right: 10%;">
    <a href="https://github.com/devarias" target="_blank">
      <img alt="twitter_page" src="https://avatars.githubusercontent.com/u/61300552?v=4" height="80" width="80">
    <p>David Arias</p>
    </a>
    <div>
      <a href="https://www.linkedin.com/in/devarias/" target="_blank" rel="noopener noreferrer">
        <img src="https://img.icons8.com/plasticine/100/000000/linkedin.png" width="35" />
      </a>
      <a href="https://www.twitter.com/DavidDevArias" target="_blank" rel="noopener noreferrer">
        <img src="https://img.icons8.com/plasticine/100/000000/twitter.png" width="35" />
      </a>
    </div>
  </div>
</div>
