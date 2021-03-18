const schedule = require('../models/Schedule');
const companies = require('../models/Companies');
const mentors = require('../models/Mentors');
const days = require('../models/Days');
const blocks = require('../models/Blocks');
const slots = require('../models/Slots');
const { Op } = require('sequelize');

async function getMeetings(req, res) {
  try {
    const joinned = await schedule.findAll({
      include: ['mentors', 'days', 'companies', 'blocks', 'slots'],
    });

    const dataToSend = [];
    for (meet of joinned) {
      const objToPush = {};
      objToPush.meet_id = meet.meet_id;

      objToPush.mentor = meet.mentors.mentor;

      if (meet.days) {
        objToPush.day = meet.days.day;
      } else {
        objToPush.day = meet.days;
      }

      if (meet.blocks) {
        objToPush.block = meet.blocks.block;
      } else {
        objToPush.block = meet.blocks;
      }

      objToPush.company = meet.companies.company;

      if (meet.slots) {
        objToPush.slot = meet.slots.slot;
      } else {
        objToPush.slot = meet.slots;
      }

      objToPush.created_at = meet.created_at;
      objToPush.updated_at = meet.updated_at;

      dataToSend.push(objToPush);
    }
    res.json(dataToSend);
  } catch (e) {
    console.error(e);
  }
}

async function cancelMeetings(req, res) {
  try {
    const data = await req.body;
    const mentorId = await mentors.findOne({
      where: {
        mentor: data[0].mentor.trim(),
      },
      attributes: ['mentor_id'],
    });
    for (comp of data[0]['Companies']) {
      const companyId = await companies.findOne({
        where: {
          company: comp.trim(),
        },
        attributes: ['company_id'],
      });
      const [numberOfAffectedRows, affectedRows] = await schedule.update(
        {
          day_id: null,
          block_id: null,
          slot_id: null,
        },
        {
          where: {
            [Op.and]: [
              { mentor_id: mentorId.mentor_id },
              { company_id: companyId.company_id },
            ],
          },
          returning: true,
          plain: true,
        }
      );
    }
    res.json({ message: 'Meetings cancelled successfully' });
  } catch (err) {
    console.error(err);
  }
}

module.exports = { getMeetings, cancelMeetings };
