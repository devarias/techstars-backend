const Mentors = require('../models/Mentors');

async function getMentors(req, res) {
  try {
    const mentors = await Mentors.findAll();
    res.json(mentors);
  } catch (error) {
    console.log(error);
  }
}

async function createMentor(req, res) {
  const { mentor, email } = req.body;
  try {
    let newMentor = await Mentors.create(
      {
        mentor,
        email,
      },
      {
        fields: ['mentor', 'email'],
      }
    );
    if (newMentor) {
      res.json({
        message: 'Mentor Created Successfully',
        data: newMentor,
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
    const mentor = await Mentors.findOne({
      where: {
        mentor_id: id,
      },
    });
    res.json(mentor);
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Mentor not found' });
  }
}

async function deleteMentor(req, res) {
  try {
    const { id } = req.params;
    const deleteRowCount = await Mentors.destroy({
      where: {
        mentor_id: id,
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
    const mentors = await Mentors.findAll({
      attributes: ['mentor_id', 'mentor', 'email'],
      where: {
        mentor_id: id,
      },
    });
    if (mentors.length > 0) {
      mentors.forEach(async (mentor_) => {
        await mentor_.update({
          mentor: mentor,
          email: email,
        });
      });
    }
    return res.json({
      message: 'Mentor Updated Successfully',
      data: mentors,
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
