const schedule = require('../models/Schedule');
const companies = require('../models/Companies');
const mentors = require('../models/Mentors');
const days = require('../models/Days');
const blocks = require('../models/Blocks');
const slots = require('../models/Slots');

async function getMeetings(req, res) {
  const meetings = await schedule.findAll();
  const dataToSend = [];
  for (meet of meetings) {
    const objToPush = {};
    objToPush.meet_id = meet.meet_id;

    objToPush.mentor = await mentors.findOne({
      where: { mentor_id: meet.mentor_id },
      attributes: ['mentor'],
    });
    objToPush.mentor = objToPush.mentor.mentor;

    if (meet.day_id && meet.day_id !== '') {
      objToPush.day = await days.findOne({
        where: { day_id: meet.day_id },
        attributes: ['day'],
      });
      objToPush.day = objToPush.day.day;
    } else {
      objToPush.day = null;
    }

    if (meet.block_id && meet.block_id !== '') {
      objToPush.block = await blocks.findOne({
        where: { block_id: meet.block_id },
        attributes: ['block'],
      });
      objToPush.block = objToPush.block.block;
    } else {
      objToPush.block = null;
    }

    objToPush.company = await companies.findOne({
      where: { company_id: meet.company_id },
      attributes: ['company'],
    });
    objToPush.company = objToPush.company.company;

    if (meet.slot_id && meet.slot_id !== '') {
      objToPush.slot = await slots.findOne({
        where: { slot_id: meet.slot_id },
        attributes: ['slot'],
      });
      objToPush.slot = objToPush.slot.slot;
    } else {
      objToPush.slot = null;
    }

    objToPush.created_at = meet.created_at;
    objToPush.updated_at = meet.updated_at;

    dataToSend.push(objToPush);
  }
  //console.log(dataToSend);
  res.json(dataToSend);
}
module.exports = { getMeetings };
