const schedule = require('../models/Schedule');
const companies = require('../models/Companies');
const days = require('../models/Days');
const blocks = require('../models/Blocks');
const slots = require('../models/Slots');
const mentors = require('../models/Mentors');

const { spawn } = require('child_process');
const { Op } = require('sequelize');
const { info } = require('console');
const fs = require('fs');

/*export function proof(req, res) {
  console.log(req.body);
  res.json({ reponse: 'finished' });
}*/

async function createSchedule(req, res) {
  const data = req.body;
  //let fileData = JSON.stringify(data);
  //fs.writeFileSync('fake_input.json', fileData);
  //console.log(data, typeof data);
  const countDeleted = await mentors.destroy({ where: {} });
  console.log({ 'Mentors deleted': countDeleted });
  data.forEach((element) => {
    console.log(element);
  });
  //Populating mentors table

  data.forEach(async (row) => {
    if (row.Name && row.Name.length > 0) {
      const check = await mentors.findOne({
        where: { mentor: row.Name.trim() },
      });
      if (check === null) {
        const newMentor = { mentor: row.Name.trim(), email: row.Email.trim() };
        await mentors.create(newMentor);
      }
    }
  });
  //Populating companies table
  await companies.destroy({ where: {} });
  data.forEach(async (row) => {
    if (row.Companies && row.Companies.length > 0) {
      const check = await companies.findOne({
        where: { company: row.Companies.trim() },
      });
      if (check === null) {
        const newCompany = {
          company: row.Companies.trim(),
          email: row.Contact.trim(),
        };
        await companies.create(newCompany);
      }
    }
  });
  // Child process:
  var dataFromPy = {};
  const python = spawn('python3', [
    './src/schedule_algorithm/schedule.py',
    JSON.stringify(data),
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
    const dataCopy = [...dataFromPy];

    //data to fill table schedule
    for (i in dataCopy[0]) {
      dataCopy[0][i].Slots = dataCopy[1][i];
    }
    for (j in dataCopy[2]) {
      dataCopy[2][j].Slots = dataCopy[3][j];
    }
    dataCopy.splice(1, 1);
    dataCopy.splice(2, 1);
    dataToFillTable = [];
    for (item of dataCopy) {
      for (elem of item) {
        dataToFillTable.push(elem);
      }
    }
    //data to send
    for (k in dataFromPy[0]) {
      const ks = Object.keys(dataFromPy[1][k]);
      for (key of ks) {
        dataFromPy[0][k][key] = dataFromPy[1][k][key];
      }
    }
    for (h in dataFromPy[2]) {
      const ks = Object.keys(dataFromPy[3][h]);
      for (key of ks) {
        dataFromPy[2][h][key] = dataFromPy[3][h][key];
      }
    }
    dataFromPy.splice(1, 1);
    dataFromPy.splice(2, 1);
    dataToSend = [];
    for (item of dataFromPy) {
      for (elem of item) {
        dataToSend.push(elem);
      }
    }
    //Send data to front
    res.json(dataToSend);

    //DELETE all records from schedule table, before filling it again with new file uploaded
    await schedule.destroy({ where: {} });
    console.log('Records deleted');

    //Process to get ids of mentors, days, blocks, companies and slots and populate schedule table
    for (meet of dataToFillTable) {
      const mentorId = await mentors.findOne({
        where: {
          mentor: meet.Mentor,
        },
        attributes: ['mentor_id'],
      });
      const dayId = await days.findOne({
        where: {
          day: meet.Day,
        },
        attributes: ['day_id'],
      });
      const blockId = await blocks.findOne({
        where: {
          block: meet.Block,
        },
        attributes: ['block_id'],
      });
      const slt = Object.keys(meet.Slots);
      for (key of slt) {
        if (meet.Slots[key] !== null) {
          const slotId = await slots.findOne({
            where: {
              slot: key,
            },
            attributes: ['slot_id'],
          });
          const companyId = await companies.findOne({
            where: {
              company: meet.Slots[key],
            },
            attributes: ['company_id'],
          });
          //console.log((mentorId.mentor_id), typeof(dayId), typeof(blockId), typeof(companyId), typeof(slotId))
          await schedule.create({
            mentor_id: mentorId.mentor_id,
            day_id: dayId.day_id,
            block_id: blockId.block_id,
            company_id: companyId.company_id,
            slot_id: slotId.slot_id,
          });
        }
      }
    }

    // finding mentors that has not been schedule yet (haven't chosen day and block but already have companies assigned)
    const allmentors = await mentors.findAll();
    const mentorsWithSchedule = await schedule.findAll({
      attributes: ['mentor_id'],
      group: ['mentor_id'],
    });
    const allmen = [];
    for (mtr of allmentors) {
      allmen.push(mtr.mentor_id);
    }
    const mentorsWithS = [];
    for (mt of mentorsWithSchedule) {
      mentorsWithS.push(mt.mentor_id);
    }

    const mentorsWithoutSchedule = [];
    for (mentor of allmen) {
      if (mentorsWithS.includes(mentor) === false) {
        mentorsWithoutSchedule.push(mentor);
      }
    }
    mentorsWithoutS = [];
    for (men of mentorsWithoutSchedule) {
      for (mn of allmentors) {
        if (mn.mentor_id === men) {
          mentorsWithoutS.push(mn);
        }
      }
    }
    const dataKeys = Object.keys(data[0]);
    const compKeys = [];
    for (k of dataKeys) {
      if (k.search('Company') !== -1) {
        compKeys.push(k);
      }
    }
    //console.log(mentorsWithoutSchedule)
    for (m of mentorsWithoutS) {
      //console.log(m);
      for (input of data) {
        //console.log(input);
        if (input.Name.trim() === m.mentor) {
          meetToSchedule = {};
          meetToSchedule.mentor_id = m.mentor_id;
          for (c of compKeys) {
            meetComp = input[c].trim();
            if (meetComp !== '') {
              meetComp = await companies.findOne({
                where: {
                  company: meetComp,
                },
                attributes: ['company_id'],
              });
              meetComp = meetComp.company_id;
              meetToSchedule.company_id = meetComp;
              await schedule.create(meetToSchedule);
            }
          }
        }
      }
    }
  });

  //await mentors.findAll().then(mentors => res.json(mentors))
}

async function getSchedule(req, res) {
  const objects = await schedule.findAll({
    attributes: ['mentor_id', 'day_id', 'block_id'],
    where: {
      [Op.not]: [{ day_id: null }],
    },
    group: ['mentor_id', 'day_id', 'block_id'],
  });
  for (obj of objects) {
    obj.dataValues.Slots = [];
    meets = await schedule.findAll({
      attributes: ['slot_id', 'company_id', 'created_at', 'updated_at'],
      where: {
        [Op.and]: [
          { mentor_id: obj.mentor_id },
          { day_id: obj.day_id },
          { block_id: obj.block_id },
        ],
      },
    });
    for (meet of meets) {
      obj.dataValues.Slots.push(meet);
    }
  }
  const dataToSend = [];
  for (ob of objects) {
    const objToPush = {};
    objToPush.mentor = await mentors.findOne({
      where: { mentor_id: ob.mentor_id },
      attributes: ['mentor', 'email'],
    });
    const email = objToPush.mentor.email;
    objToPush.mentor = objToPush.mentor.mentor;
    objToPush.email = email;

    objToPush.day = await days.findOne({
      where: { day_id: ob.day_id },
      attributes: ['day'],
    });
    objToPush.day = objToPush.day.day;

    objToPush.block = await blocks.findOne({
      where: { block_id: ob.block_id },
      attributes: ['block'],
    });
    objToPush.block = objToPush.block.block;

    objToPush.Slots = [];
    for (sl of ob.dataValues.Slots) {
      const slObj = {};
      slObj.slot = await slots.findOne({
        where: { slot_id: sl.slot_id },
        attributes: ['slot'],
      });
      slObj.slot = slObj.slot.slot;

      slObj.company = await companies.findOne({
        where: { company_id: sl.company_id },
        attributes: ['company'],
      });
      slObj.company = slObj.company.company;

      slObj.created_at = sl.created_at;
      slObj.updated_at = sl.updated_at;

      objToPush.Slots.push(slObj);
    }
    dataToSend.push(objToPush);
  }
  //console.log(dataToSend);
  res.json(dataToSend);
}
module.exports = { createSchedule, getSchedule };
