const schedule = require('../models/Schedule');
const companies = require('../models/Companies');
const mentors = require('../models/Mentors');
const days = require('../models/Days');
const blocks = require('../models/Blocks');
const slots = require('../models/Slots');
const { Op } = require('sequelize');

async function getTable(req, res) {
  try {
    const dataPreview = [];
    const slotsIds = await slots.findAll();
    const objects = await schedule.findAll({
      attributes: ['mentor_id', 'day_id', 'block_id'],
      where: {
        [Op.not]: [{ day_id: null }],
      },
      group: ['mentor_id', 'day_id', 'block_id'],
    });
    for (obj of objects) {
      meets = await schedule.findAll({
        attributes: ['slot_id', 'company_id'],
        where: {
          [Op.and]: [
            { mentor_id: obj.mentor_id },
            { day_id: obj.day_id },
            { block_id: obj.block_id },
          ],
        },
      });
      for (meet of meets) {
        obj.dataValues[meet.slot_id] = meet.company_id;
      }
      for (slotId of slotsIds) {
        if (obj.dataValues.hasOwnProperty(slotId.slot_id) === false) {
          obj.dataValues[slotId.slot_id] = null;
        }
      }
      dataPreview.push(obj);
    }
    const dataToSend = [];
    const props = Object.keys(dataPreview[0].dataValues);
    for (ob of dataPreview) {
      const objToPush = {};
      mentorInfo = await mentors.findOne({
        where: { mentor_id: ob.mentor_id },
        attributes: ['mentor_id', 'mentor', 'email'],
      });
      objToPush.mentor_id = mentorInfo.mentor_id;
      objToPush.Mentor = mentorInfo.mentor;
      objToPush.Email = mentorInfo.email;

      objToPush.Day = await days.findOne({
        where: { day_id: ob.day_id },
        attributes: ['day'],
      });
      objToPush.Day = objToPush.Day.day;

      objToPush.Block = await blocks.findOne({
        where: { block_id: ob.block_id },
        attributes: ['block'],
      });
      objToPush.Block = objToPush.Block.block;
      for (sl of slotsIds) {
        if (ob.dataValues[sl.slot_id] !== null) {
          objToPush[sl.slot] = await companies.findOne({
            where: { company_id: ob.dataValues[sl.slot_id] },
            attributes: ['company'],
          });
          objToPush[sl.slot] = objToPush[sl.slot].company;
        } else {
          objToPush[sl.slot] = null;
        }
      }
      dataToSend.push(objToPush);
    }
    res.json(dataToSend);
  } catch (e) {
    console.error(e);
  }
}
module.exports = { getTable };
