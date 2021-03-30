require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const sgMail = require('@sendgrid/mail');
const mentorsApi = 'https://techstars-api.herokuapp.com/api/mentors';
const companiesApi = 'https://techstars-api.herokuapp.com/api/companies';
const apiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(apiKey);

async function sendReminderMentors(req, res) {
  const mentors = await axios
    .get(mentorsApi)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(err);
    });
  const reminders = req.body;
  for (let i = 0; i < reminders.length; i++) {
    for (let j = 0; j < mentors.length; j++) {
      if (reminders[i] === mentors[j].mentor) {
        const mentorMessage = {
          to: mentors[j].email, // Change to your recipient
          from: 'alba.montana.techstars@gmail.com', // Change to your verified sender
          templateId: 'd-8f1a632e8db04ed98ea923c163bce086',
          dynamic_template_data: {
            name: mentors[j].mentor,
            id: mentors[j].mentor_id,
          },
        };
        sgMail
          .send(mentorMessage)
          .then(() => {
            console.log(
              'mentor Email sent -->' +
                mentors[j].mentor +
                '-->' +
                mentors[j].email
            );
          })
          .catch((error) => {
            console.error(error.response.body);
          });
      }
    }
  }
  res.json({ success: true });
}
async function sendReminderCompanies(req, res) {
  const companies = await axios
    .get(companiesApi)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(err);
    });
  const reminders = req.body;
  for (let i = 0; i < reminders.length; i++) {
    for (let j = 0; j < companies.length; j++) {
      if (reminders[i] === companies[j].company) {
        const companyMessage = {
          to: companies[j].email, // Change to your recipient
          from: 'alba.montana.techstars@gmail.com', // Change to your verified sender
          templateID: 'd-8c4d6f887f324edd88db713459714644',
          dynamic_template_data: {
            name: companies[j].company,
            id: companies[j].company_id,
          },
        };
        sgMail
          .send(companyMessage)
          .then(() => {
            console.log(
              'company Email sent -->' +
                companies[j].company +
                '-->' +
                companies[j].email
            );
          })
          .catch((error) => {
            console.error(error.response.body);
          });
      }
    }
  }
  res.json({ success: true });
}

module.exports = { sendReminderMentors, sendReminderCompanies };
