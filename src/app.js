const express = require('express');
const { json } = require('express');
const morgan = require('morgan');

//importing routes
const mentorRoutes = require('./routes/mentors');
const companiesRoutes = require('./routes/companies');
const mentorSurveyRoutes = require('./routes/mentor_survey');
const companySurveyRoutes = require('./routes/company_survey');
const scheduleRoutes = require('./routes/schedule');
const rescheduleRoutes = require('./routes/reschedule');
const meetingsRoutes = require('./routes/meetings');
const resultsRoutes = require('./routes/results');
const cors = require('cors');

//initialize server
const app = express();
//middlewares

app.use(cors());
app.use(morgan('dev'));
app.use(json());

//routes
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentor_survey', mentorSurveyRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/company_survey', companySurveyRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/reschedule', rescheduleRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/results', resultsRoutes);
module.exports = app;
