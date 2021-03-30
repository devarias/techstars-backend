const axios = require('axios');
const cron = require('node-cron');
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

//const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//Cron format: '0 0-23/6 * * *' every 6 hours -- '0 12,18 * * *'
function isToday(meetingDay) {
  let date = Date();
  if (meetingDay.substring(0, 3) == date.substring(0, 3)) {
    return true;
  }
  return false;
}
function meetingHapenned(meetingSlot) {
  let date = Date();
  if (
    meetingSlot.substring(0, 2) < date.split(' ')[4].substring(0, 2) &&
    meetingSlot.substring(0, 2) > date.split(' ')[4].substring(0, 2) - '12'
  ) {
    return true;
  }
  return false;
}
function sendMails() {
  const sendMentorEmails = cron.schedule(
    '30 12,6 * * *',
    async () => {
      const response = await axios.get(
          'https://techstars-api.herokuapp.com/api/meetings'
        ),
        mentors = await axios.get(
          'https://techstars-api.herokuapp.com/api/mentors'
        );
      let mail_sent = [];
      response.data.forEach(async (meeting) => {
        if (meeting.day && meeting.block && meeting.slot) {
          if (isToday(meeting.day) && meetingHapenned(meeting.slot)) {
            const mentor_email = mentors.data.find(
                (mentor_data) => meeting.mentor == mentor_data.mentor
              ).email,
              mentor_id = mentors.data.find(
                (mentor_data) => meeting.mentor == mentor_data.mentor
              ).mentor_id,
              mentor_name = mentors.data.find(
                (mentor_data) => meeting.mentor == mentor_data.mentor
              ).mentor;
            if (mail_sent.includes(mentor_name) === false) {
              console.log(
                'mentor email -> ' +
                  mentor_email +
                  '\n' +
                  'mentor_id --> ' +
                  mentor_id +
                  '\n' +
                  'mentor_name -->' +
                  mentor_name +
                  '\n',
                '\n----------------------------------------------------\n'
              );

              const mentorMessage = {
                to: mentor_email, // Change to your recipient
                from: 'alba.montana.techstars@gmail.com', // Change to your verified sender
                subject:
                  '[Action required] Which mentor would you like to work with',
                text: `Hi ${mentor_name} \n Thanks for sharing your with companies today.\
                  When you get a chance, please select the companies you want to mentor,\
                  will not mentor, or willing to mentor via this short form: http://techstars-app.herokuapp.com/survey/${mentor_id}`,
              };

              sgMail
                .send(mentorMessage)
                .then(() => {
                  console.log(
                    'mentor Email sent -->' + mentor_name + '-->' + mentor_email
                  );
                })
                .catch((error) => {
                  console.error(error.response.body);
                });
              mail_sent.push(mentor_name);
            }
          }
        }
      });
    },
    { timezone: 'America/Denver' }
  );
  const sendCompanyEmails = cron.schedule(
    '30 6 * * *',
    async () => {
      const response = await axios.get(
          'https://techstars-api.herokuapp.com/api/meetings'
        ),
        companies = await axios.get(
          'https://techstars-api.herokuapp.com/api/companies'
        );
      let mail_sent = [];
      response.data.forEach(async (meeting) => {
        if (meeting.day && meeting.block && meeting.slot) {
          if (isToday(meeting.day) && meetingHapenned(meeting.slot)) {
            const company_email = companies.data.find(
                (company_data) => meeting.company == company_data.company
              ).email,
              company_id = companies.data.find(
                (company_data) => meeting.company == company_data.company
              ).company_id,
              company_name = companies.data.find(
                (company_data) => meeting.company == company_data.company
              ).company;
            if (mail_sent.includes(mentor_name) === false) {
              console.log(
                'mentor email -> ' +
                  mentor_email +
                  '\n' +
                  'mentor_id --> ' +
                  mentor_id +
                  '\n' +
                  'mentor_name -->' +
                  mentor_name +
                  '\n',
                '\n----------------------------------------------------\n'
              );
              const companyMessage = {
                to: company_email, // Change to your recipient
                from: 'alba.montana.techstars@gmail.com', // Change to your verified sender
                subject:
                  '[Action required] Which mentor would you like to work with',
                text: `Hi ${company_name} \n Thanks for sharing your with companies today.\
                  When you get a chance, please select the companies you want to mentor,\
                  will not mentor, or willing to mentor via this short form: http://techstars-app.herokuapp.com/survey/${company_id}`,
              };
              sgMail
                .send(companyMessage)
                .then(() => {
                  console.log(
                    'company Email sent -->' +
                      company_name +
                      '-->' +
                      company_email
                  );
                })
                .catch((error) => {
                  console.error(error.response.body);
                });
              mail_sent.push(company_name);
            }
          }
        }
      });
    },
    { timezone: 'America/Denver' }
  );
  sendCompanyEmails.start();
  sendMentorEmails.start();
}
exports.sendMails = sendMails;
