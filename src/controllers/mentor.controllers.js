const schedule = require('../models/Schedule');
const companies = require('../models/Companies');
const mentors = require('../models/Mentors');
const days = require('../models/Days');
const blocks = require('../models/Blocks');
const slots = require('../models/Slots');
const { spawn } = require('child_process');

async function getMentors(req, res) {
  try {
    const mentors_ = await mentors.findAll();
    res.json(mentors_);
  } catch (error) {
    console.log(error);
  }
}

async function createMentor(req, res) {
  try {
    const data = await req.body;
    let newMentorId = '';
    try {
      if (data[0].mentor && data[0].mentor.length > 0) {
        const check = await mentors.findOne({
          where: { mentor: data[0].mentor.trim() },
        });
        if (check === null) {
          const newMentor = await mentors.create({
            mentor: data[0].mentor.trim(),
            email: data[0].email.trim(),
          });
          newMentorId = newMentor.mentor_id;
        } else {
          res.status(400).json({ message: 'Mentor already exists' });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error:
          'It was not possible to create the mentor, please check the data entered and try again',
      });
    }
    for (comp of data[0].Companies) {
      try {
        meetComp = await companies.findOne({
          where: {
            company: comp,
          },
          attributes: ['company_id'],
        });
        meetComp = meetComp.company_id;
        const meetScheduled = await schedule.create({
          mentor_id: newMentorId,
          company_id: meetComp,
        });
      } catch (error) {
        res.status(400).json({
          error: 'Company does not exists',
        });
      }
    }
    const mentorToSchedule = [
      { mentor: data[0].mentor.trim(), Companies: data[0].Companies },
    ];
    try {
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
        './src/schedule_algorithm/reschedule.py',
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
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error:
          'It was not possible to schedule the mentor, please check the data entered and try again',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Something goes wrong !!',
      data: {},
    });
  }
}

async function getMentorById(req, res) {
  try {
    const { id } = req.params;
    const mentor_ = await mentors.findOne({
      where: {
        mentor_id: id,
      },
    });
    res.json(mentor_);
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Mentor not found' });
  }
}

async function deleteMentor(req, res) {
  try {
    const data = await req.body;
    const mentorId = await mentors.findOne({
      where: {
        mentor: data.mentor.trim(),
      },
      attributes: ['mentor_id'],
    });
    const deleteRowCount = await mentors.destroy({
      where: {
        mentor_id: mentorId.mentor_id,
      },
    });
    res.json({
      message: 'Mentor Deleted Successfully',
      count: deleteRowCount,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Mentor not found' });
  }
}

async function updateMentor(req, res) {
  try {
    const { id } = req.params;
    const { mentor, email } = req.body;
    const mentors_ = await mentors.findAll({
      attributes: ['mentor_id', 'mentor', 'email'],
      where: {
        mentor_id: id,
      },
    });
    if (mentors_.length > 0) {
      mentors_.forEach(async (mentor_) => {
        await mentor_.update({
          mentor: mentor,
          email: email,
        });
      });
    }
    return res.json({
      message: 'Mentor Updated Successfully',
      data: mentors_,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Mentor not found' });
  }
}
module.exports = {
  getMentors,
  createMentor,
  getMentorById,
  deleteMentor,
  updateMentor,
};
