const {prisma}=require('@prisma/client')
const { z } = require('zod');

const ResourceInputSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().nullable(),
    imageUrl: z.string().url('Invalid URL format').nullable(),
    isSharable: z.boolean().default(true),
    zoneId: z.string().nullable(),
    ownerId: z.string(),
});
async function CreateResource(input) {
    const validationResult=ResourceInputSchema.safeParse(input);
    if (!validationResult.success) {
        throw new Error(
            `Validation error: ${validationResult.error.issues
                .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                .join(', ')}`
        );
    }
    const res=validationResult.data;
    try {
        const existingResource = await prisma.resource.findFirst({
            where: {
                title: res.title,
                ownerId: res.ownerId,
            },
        });

        if (existingResource) {
            throw new Error("Resource with this title already exists");
        }

        const newResource = await prisma.resource.create({
            data: {
                title: res.title,
                description: res.description,
                category: res.category,
                imageUrl: res.imageUrl,
                isSharable: res.isSharable,
                zoneId: res.zoneId,
                ownerId: res.ownerId,
            },
        });
        console.log(`Resource created successfully: ${newResource.title}`); // Add logging

        return newResource; 
    } catch (error) {
        console.error(`Error creating resource: ${error.message}`);
        throw error;
        
    } 
        
    
}
async function GetResourceByUsername(username){
    try {
        const resource=await prisma.resource.findMany({
            where:{
                owner:{
                    username:username
                }
            }
        })
        if(!resource){
            throw new Error("Resource not found")
        }
        return resource
        
    } catch (error) {
        console.error(`Error fetching resource: ${error.message}`);
        throw error;
        
    }
}
async function DeleteResource(id){
    try {
        const resource=await prisma.resource.delete({
            where:{
                id:id
            }
        })
        if(!resource){
            throw new Error("Resource not found")
        }
        return resource
        
    } catch (error) {
        console.error(`Error deleting resource: ${error.message}`);
        throw error;
        
    }
}
async function UpdateResource(id, input){
    const validationResult=ResourceInputSchema.safeParse(input);
    if (!validationResult.success) {
        throw new Error(
            `Validation error: ${validationResult.error.issues
                .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                .join(', ')}`
        );
    }
    const res=validationResult.data;
    try {
        const resource=await prisma.resource.update({
            where:{
                id:id
            },
            data:{
                title:res.title,
                description:res.description,
                category:res.category,
                imageUrl:res.imageUrl,
                isSharable:res.isSharable,
                zoneId:res.zoneId,
                ownerId:res.ownerId,
            }
        })
        if(!resource){
            throw new Error("Resource not found")
        }
        return resource
        
    } catch (error) {
        console.error(`Error updating resource: ${error.message}`);
        throw error;
        
    }
}
async function GetResourceById(id){
    try {
        const resource=await prisma.resource.findUnique({
            where:{
                id:id
            }
        })
        if(!resource){
            throw new Error("Resource not found")
        }
        return resource
        
    } catch (error) {
        console.error(`Error fetching resource: ${error.message}`);
        throw error;
        
    }
}
async function GetAllResources(){
    try {
        const resource=await prisma.resource.findMany()
        if(!resource){
            throw new Error("Resource not found")
        }
        return resource
        
    } catch (error) {
        console.error(`Error fetching resource: ${error.message}`);
        throw error;
        
    }
}
async function GetResourceByZoneId(zoneId){
    try {
        const resource=await prisma.resource.findMany({
            where:{
                zoneId:zoneId
            }
        })
        if(!resource){
            throw new Error("Resource not found")
        }
        return resource
        
    } catch (error) {
        console.error(`Error fetching resource: ${error.message}`);
        throw error;
        
    }
}
async function GetResourceByCategory(category){
    try {
        const resource=await prisma.resource.findMany({
            where:{
                category:category
            }
        })
        if(!resource){
            throw new Error("Resource not found")
        }
        return resource
        
    } catch (error) {
        console.error(`Error fetching resource: ${error.message}`);
        throw error;
        
    }
}
async function GetResourceByOwnerId(ownerId){
    try {
        const resource=await prisma.resource.findMany({
            where:{
                ownerId:ownerId
            }
        })
        if(!resource){
            throw new Error("Resource not found")
        }
        return resource
        
    } catch (error) {
        console.error(`Error fetching resource: ${error.message}`);
        throw error;
        
    }
}
async function GetResourceByTitle(title){
    try {
        const resource=await prisma.resource.findMany({
            where:{
                title:title
            }
        })
        if(!resource){
            throw new Error("Resource not found")
        }
        return resource
        
    } catch (error) {
        console.error(`Error fetching resource: ${error.message}`);
        throw error;
        
    }
}
async function GetResourceByDescription(description){
    try {
        const resource=await prisma.resource.findMany({
            where:{
                description:description
            }
        })
        if(!resource){
            throw new Error("Resource not found")
        }
        return resource
        
    } catch (error) {
        console.error(`Error fetching resource: ${error.message}`);
        throw error;
        
    }
}


module.exports = {
    CreateResource,
    GetResourceByUsername,
    DeleteResource,
    UpdateResource,
    GetResourceById,
    GetAllResources,
    GetResourceByZoneId,
    GetResourceByCategory,
    GetResourceByOwnerId,
    GetResourceByTitle,
    GetResourceByDescription,
};