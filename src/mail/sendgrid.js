const axios = require('axios');
const cron = require('node-cron');
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY =
  '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';
sgMail.setApiKey(SENDGRID_API_KEY);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
function setTasks() {
  const checkMeetings = cron.schedule(
    '0-59/2 * * * *',
    async () => {
      const response = await axios.get(
          'https://techstars-api.herokuapp.com/api/meetings'
        ),
        mentors = await axios.get(
          'https://techstars-api.herokuapp.com/api/mentors'
        ),
        companies = await axios.get(
          'https://techstars-api.herokuapp.com/api/companies'
        );
      console.log('--------------Block--------------');
      let i = 0;
      let mail_sent = [];
      response.data.forEach(async (meeting) => {
        if (meeting.day && meeting.block && meeting.slot) {
          if (isToday(meeting.day) && meetingHapenned(meeting.slot)) {
            const mentor_email = mentors.data.find(
                (mentor_data) => meeting.mentor == mentor_data.mentor
              ).email,
              company_email = companies.data.find(
                (company_data) => meeting.company == company_data.company
              ).email,
              mentor_id = mentors.data.find(
                (mentor_data) => meeting.mentor == mentor_data.mentor
              ).mentor_id,
              company_id = companies.data.find(
                (company_data) => meeting.company == company_data.company
              ).company_id,
              company_name = companies.data.find(
                (company_data) => meeting.company == company_data.company
              ).company,
              mentor_name = mentors.data.find(
                (mentor_data) => meeting.mentor == mentor_data.mentor
              ).mentor;
            i += 1;
            //console.log(meeting, i);
            if (
              mail_sent.includes(mentor_name) === false &&
              mail_sent.includes(company_name) === false
            ) {
              console.log(
                'company email -> ' +
                  company_email +
                  '\n' +
                  'mentor email -> ' +
                  mentor_email +
                  '\n' +
                  'mentor_id --> ' +
                  mentor_id +
                  '\n' +
                  'company_id --> ' +
                  company_id +
                  '\n' +
                  'company_name -->' +
                  company_name +
                  '\n' +
                  'mentor_name -->' +
                  mentor_name +
                  '\n',
                '\n----------------------------------------------------\n',
                i
              );
              mail_sent.push(mentor_name);
              mail_sent.push(company_name);
              const mentorMessage = {
                to: mentor_email, // Change to your recipient
                from: 'finalprojectc12med@gmail.com', // Change to your verified sender
                subject:
                  '[Action required] Which mentor would you like to work with',
                text: `Hi ${mentor_name} \n Thanks for sharing your with companies today.\
                  When you get a chance, please select the companies you want to mentor,\
                  will not mentor, or willing to mentor via this short form: http://techstars-app.herokuapp.com/survey/${mentor_id}`,
              };
              const companyMessage = {
                to: company_email, // Change to your recipient
                from: 'finalprojectc12med@gmail.com', // Change to your verified sender
                subject:
                  '[Action required] Which mentor would you like to work with',
                text: `Hi ${company_name} \n Thanks for sharing your with companies today.\
                  When you get a chance, please select the companies you want to mentor,\
                  will not mentor, or willing to mentor via this short form: http://techstars-app.herokuapp.com/survey/${company_id}`,
              };
              await sleep(10000);
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
              await sleep(10000);
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
            }
          }
        }
      });
    },
    { timezone: 'America/Denver' }
  );
  checkMeetings.start();
}
setTasks();
