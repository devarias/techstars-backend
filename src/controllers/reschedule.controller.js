const schedule = require('../models/Schedule');
const companies = require('../models/Companies');
const days = require('../models/Days');
const blocks = require('../models/Blocks');
const slots = require('../models/Slots');

const { spawn } = require('child_process');
const { Op } = require('sequelize');
const { info } = require('console');
//const fs = require('fs')

async function createReschedule(req, res) {
  const data = await req.body;
  //console.log(JSON.stringify(data));

  let currentSchedule = await schedule.findAll();
  currentSchedule = JSON.stringify(currentSchedule);

  let currentCompanies = await companies.findAll();
  currentCompanies = JSON.stringify(currentCompanies);

  let currentBlocks = await blocks.findAll();
  currentBlocks = JSON.stringify(currentBlocks);

  let currentDays = await days.findAll();
  currentDays = JSON.stringify(currentDays);

  let currentSlots = await slots.findAll();
  currentSlots = JSON.stringify(currentSlots);

  let currentMentors = await mentors.findAll();
  currentMentors = JSON.stringify(currentMentors);

  var dataFromPy = {};
  const python = spawn('python3', [
    './src/schedule_algorithm//reschedule.py',
    JSON.stringify(data),
    currentSchedule,
    currentCompanies,
    currentBlocks,
    currentDays,
    currentSlots,
    currentMentors,
  ]);
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataFromPy = data.toString();
    dataFromPy = JSON.parse(dataFromPy);
  });
  python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', async (code) => {
    console.log(`child process close all stdio with code ${code}`);
    res.json(dataFromPy);
  });
}
async function updateMeetings(req, res) {
  const data = await req.body;
  const mentorId = await mentors.findOne({
    where: {
      mentor: data.Mentor,
    },
    attributes: ['mentor_id'],
  });
  const dayId = await days.findOne({
    where: {
      day: data.Day,
    },
    attributes: ['day_id'],
  });
  const blockId = await blocks.findOne({
    where: {
      block: data.Block,
    },
    attributes: ['block_id'],
  });
  dataKeys = Object.keys(data);
  for (key of sataKeys) {
    if (key !== 'Mentor' && key !== 'Day' && key != 'Block') {
      if (data[key] !== null) {
        const slotId = await slots.findOne({
          where: {
            slot: key,
          },
          attributes: ['slot_id'],
        });
        const companyId = await companies.findOne({
          where: {
            company: data[key],
          },
          attributes: ['company_id'],
        });
        const currentMeet = await schedule.findOne({
          where: {
            mentor_id: mentorId.mentor_id,
            company_id: companyId.company_id,
          },
        });
        // currentMeet.day_id = dayId.day_id;
        // currentMeet.block_id = blockId.block_id;
        // currentMeet.slot_id = slotId.slot_id;
        // currentMeet.save()
        await schedule.update(
          {
            day_id: dayId.day_id,
            block_id: blockId.block_id,
            slot_id: slotId.slot_id,
          },
          {
            where: {
              mentor_id: mentorId.mentor_id,
              company_id: companyId.company_id,
            },
          }
        );
        // await schedule.create({
        //   mentor_id: mentorId.mentor_id,
        //   day_id: dayId.day_id,
        //   block_id: blockId.block_id,
        //   company_id: companyId.company_id,
        //   slot_id: slotId.slot_id,
        // });
      }
    }
  }
}
module.exports = { createReschedule, updateMeetings };
