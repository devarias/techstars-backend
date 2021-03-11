const { Router } = require('express');
const {
  createMentor,
  getMentors,
  getMentorById,
  deleteMentor,
  updateMentor,
} = require('../controllers/mentor.controllers');
const router = Router();
//Mentors data
router.post('/', createMentor);
router.get('/', getMentors);
//Mentor data by id
router.get('/:id', getMentorById);
router.delete('/:id', deleteMentor);
router.put('/:id', updateMentor);
module.exports = router;
