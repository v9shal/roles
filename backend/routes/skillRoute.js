
const express = require('express');
const router = express.Router();
const { registerSkill,GetSkillByUsername,GetSkillById, deleteSkill, getAllSkills } = require('../controller/skillController');

router.post('/uploadskills', registerSkill);
router.get('/getskills/:username', GetSkillByUsername);
router.get('/getskillsbyid/:id', GetSkillById);
router.delete('/deleteskill/:skillName', deleteSkill);
router.get('/getskills',getAllSkills);

module.exports = router;