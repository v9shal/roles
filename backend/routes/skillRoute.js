
const express = require('express');
const router = express.Router();
const { registerSkill,GetSkillByUsername,GetSkillById, deleteSkill, GetAllSkills } = require('../controller/skillController');

router.post('/uploadskills', registerSkill);
router.get('/getskills/:username', GetSkillByUsername);
router.get('/getskillsbyid/:id', GetSkillById);
router.delete('/deleteskill/:skillName', deleteSkill);
router.get('/getskills',GetAllSkills);

module.exports = router;