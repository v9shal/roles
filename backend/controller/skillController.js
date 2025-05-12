const {
    DeleteSkill,
    getAllSkills,
    UpdateSkill,
    CreateSkill
  } = require('../actions/skill_action');
  const jwt = require('jsonwebtoken');
  const uploadToS3 = require('../services/s3Services');
const upload = uploadToS3.single('image'); 
const multer = require('multer');
  
  // CREATE
  function handleFileUpload(req, res, next) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Multer error: ${err.message}` });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (req.file) {
        req.body.imageUrl = req.file.location; 
      }
      
      next();
    });
  }
  async function registerSkill(req, res) {
    try {
      const skill = await CreateSkill(req.body);
      res.status(201).json(skill);
    } catch (error) {
      console.error("Error during skill registration:", error);
      res.status(500).json({ error: "An error occurred while registering the skill. Please try again later." });
    }
  }
  async function GetSkillByUsername(req,res) {
    try {
        const {username} = req.params;
        if (!username || typeof username !== 'string') {
            return res.status(400).json({ error: "Invalid username" });
          }
        const skill = await GetSkillByUsername(username);
        if (!skill) {
            return res.status(404).json({ error: `Skill with username "${username}" not found.` });
          }
        res.status(200).json(skill);

    } catch (error) {
        
        console.error(`Error fetching skills for user ${req.params.username}:`, error);
        res.status(500).json({ error: "An error occurred while fetching the skills." });
      }
    
  }
  async function GetSkillById(req,res) {
    try {
        const {id} = req.params;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: "Invalid skill ID" });
          }
        const skill = await GetSkillById(id);
        if (!skill) {
            return res.status(404).json({ error: `Skill with ID "${id}" not found.` });
          }
        res.status(200).json(skill);

    } catch (error) {
        
        console.error(`Error fetching skill with ID ${req.params.id}:`, error);
        res.status(500).json({ error: "An error occurred while fetching the skill." });
      }
  }
  async function deleteSkill(req, res) {
    try {
      const { skillName } = req.params;
      if (!skillName || typeof skillName !== 'string') {
        return res.status(400).json({ error: "Invalid skill name" });
      }
  
      const deletedSkill = await DeleteSkill(skillName);
      if (!deletedSkill) {
        return res.status(404).json({ error: `Skill with name "${skillName}" not found.` });
      }
  
      res.status(200).json({ message: `Skill "${skillName}" deleted successfully.` });
    } catch (error) {
      console.error(`Error deleting skill "${req.params.skillName}":`, error);
      res.status(500).json({ error: "An error occurred while deleting the skill." });
    }
  }
  
  async function getAllSkills(req, res) {
    try {
      const skills = await getAllSkills();
      res.status(200).json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ error: "An error occurred while fetching skills." });
    }
  }
  
  async function updateSkill(req, res) {
    try {
      const { skillName } = req.params;
      const updatedData = req.body;
  
      if (!skillName || typeof skillName !== 'string') {
        return res.status(400).json({ error: "Invalid skill name" });
      }
  
      const updatedSkill = await UpdateSkill(skillName, updatedData);
      if (!updatedSkill) {
        return res.status(404).json({ error: `Skill "${skillName}" not found.` });
      }
  
      res.status(200).json({ message: `Skill "${skillName}" updated successfully`, skill: updatedSkill });
    } catch (error) {
      console.error("Error updating skill:", error);
      res.status(500).json({ error: "An error occurred while updating the skill." });
    }
  }
  
  module.exports = {
    registerSkill,
    deleteSkill,
    getAllSkills,
    updateSkill,
    GetSkillById,
    GetSkillByUsername,handleFileUpload };
  