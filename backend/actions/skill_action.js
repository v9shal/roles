const { PrismaClient } = require('@prisma/client'); // Import the class
const { z } = require('zod');

const prisma = new PrismaClient();

const SkillInputSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().nullable(),
    ownerId: z.string(),
    //zoneId: z.string().nullable(),
});
async function getAllSkills(input) {
    try {
        const validateResult=SkillInputSchema.safeParse(input
        );
        if (!validateResult.success) {
            throw new Error(
                `Validation error: ${validateResult.error.issues
                    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                    .join(', ')}`
            );
        }
        const res=validateResult.data;
        const skills = await prisma.skill.findMany({
            where: {
                ownerId: res.ownerId,
            },
        });
        return skills;
    } catch (error) {
        console.error(`Error fetching all skills: ${error.message}`);
        throw error;
    }
}
async function CreateSkill(input) {
    try {
        const validateResult=SkillInputSchema.safeParse(input
        );
        if (!validateResult.success) {
            throw new Error(
                `Validation error: ${validateResult.error.issues
                    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                    .join(', ')}`
            );
        }
        const res=validateResult.data;

        const existingSkill = await prisma.skill.findFirst({
            where: {
                title: res.title,
                ownerId: res.ownerId,
            },
        });
        if (existingSkill) {
            throw new Error("Skill with this title already exists");
        }
        const newSkill = await prisma.skill.create({
            data: {
                title: res.title,
                description: res.description,
                ownerId: res.ownerId,
                zoneId: res.zoneId,
            },
        });
        console.log(`Skill created successfully: ${newSkill.title}`); // Add logging
        return newSkill;
        
    } catch (error) {
        console.error(`Error creating skill: ${error.message}`);
        throw error;
        
    }
}
async function GetSkillByUsername(username){
    try {
        const skill=await prisma.skill.findMany({
            where:{
                owner:{
                    username:username
                }
            }
        });
        return skill;
    } catch (error) {
        console.error(`Error fetching skills for user ${username}: ${error.message}`);
        throw error;
    }
}
async function GetSkillById(id){
    try {
        const skill=await prisma.skill.findUnique({
            where:{
                id:id
            }
        });
        if(!skill){
            throw new Error("Skill not found")
        }
        return skill;
    } catch (error) {
        console.error(`Error fetching skill with ID ${id}: ${error.message}`);
        throw error;
    }
}
async function DeleteSkill(id){
    try {
        const skill=await prisma.skill.delete({
            where:{
                id:id
            }
        });
        return skill;
    } catch (error) {
        console.error(`Error deleting skill with ID ${id}: ${error.message}`);
        throw error;
    }
}
async function UpdateSkill(id, input) {
    try {
        const validateResult=SkillInputSchema.safeParse(input
        );
        if (!validateResult.success) {
            throw new Error(
                `Validation error: ${validateResult.error.issues
                    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                    .join(', ')}`
            );
        }
        const res=validateResult.data;
        const skill=await prisma.skill.update({
            where:{
                id:id
            },
            data:{
                title:res.title,
                description:res.description,
                zoneId:res.zoneId
            }
        })
        return skill;
    } catch (error) {
        console.error(`Error updating skill with ID ${id}: ${error.message}`);
        throw error;
    }
}
module.exports={
    CreateSkill,
    GetSkillByUsername,
    GetSkillById,
    DeleteSkill,
    UpdateSkill,
    getAllSkills
}
