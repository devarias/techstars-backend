const axios = require('axios');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
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
    '0-59/1 * * * *',
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
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'finalprojectc12med@gmail.com',
                  pass: 'HolbertonC12',
                },
              });
              let mentorMessageOptions = {
                from: 'finalprojectc12med@gmail.com',
                to: `${mentor_email}`,
                subject: 'Scheduled Email',
                text: `Hi ${mentor_name}. Remember to fill out this survey: http://techstars-app.herokuapp.com/survey/${mentor_id}`,
              };
              let companyMessageOptions = {
                from: 'finalprojectc12med@gmail.com',
                to: `${company_email}`,
                subject: 'Scheduled Email',
                text: `Hi ${company_name}. Remember to fill out this survey http://techstars-app.herokuapp.com/survey/${company_id}`,
              };
              await sleep(10000);
              transporter.sendMail(
                mentorMessageOptions,
                function (error, info) {
                  if (error) {
                    throw error;
                  } else {
                    console.log(
                      `Mentor mail successfully sent! ${mentor_name} --> ${mentor_email}`
                    );
                  }
                }
              );
              await sleep(10000);
              transporter.sendMail(
                companyMessageOptions,
                function (error, info) {
                  if (error) {
                    throw error;
                  } else {
                    console.log(
                      `Company mail successfully sent!' ${company_name} --> ${company_email}`
                    );
                  }
                }
              );
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