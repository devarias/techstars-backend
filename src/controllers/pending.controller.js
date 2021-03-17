const schedule = require('../models/Schedule');
const companies = require('../models/Companies');
const mentors = require('../models/Mentors');
const { Op } = require('sequelize');

exports.getPending = async (req, res) => {
  try {
    const objects = await schedule.findAll({
      attributes: ['mentor_id', 'day_id', 'block_id'],
      where: {
        day_id: {
          [Op.is]: null,
        },
      },
      group: ['mentor_id', 'day_id', 'block_id'],
    });
    const dataToSend = [];
    for (obj of objects) {
      const companies = [];
      const pendingMeets = await schedule.findAll({
        attributes: ['company_id'],
        where: {
          [Op.and]: [
            { mentor_id: obj.mentor_id },
            { day_id: obj.day_id },
            { block_id: obj.block_id },
          ],
        },
      });
      for (meet of pendingMeets) {
        companies.push(meet.company_id);
      }
      dataToSend.push({ mentor: obj.mentor_id, Companies: companies });
    }
    for (ob of dataToSend) {
      const mentorName = await mentors.findOne({
        where: { mentor_id: ob.mentor },
        attributes: ['mentor'],
      });
      ob.mentor = mentorName.mentor;
      for (c in ob.Companies) {
        const cp = await companies.findOne({
          where: { company_id: ob.Companies[c] },
          attributes: ['company'],
        });
        ob.Companies[c] = cp.company;
      }
    }
    res.json(dataToSend);
  } catch (e) {
    console.error(e);
  }
};

module.exports = { getPending };
