const { PrismaClient } = require('@prisma/client'); 
const { z } = require('zod');

const prisma = new PrismaClient(); 
const ResourceInputSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().nullable(),
    imageUrl: z.string().url('Invalid URL format').nullable(),
    isSharable: z.preprocess(
        (val) => {
            const lowerVal = String(val).toLowerCase();
            return lowerVal === 'true' || lowerVal === '1'; 
        },
        z.boolean()
    ),
   // zoneId: z.string().nullable(),
   ownerId: z.string(), 
});

async function CreateResource(input) {
    const validationResult = ResourceInputSchema.safeParse(input);
    if (!validationResult.success) {
        const errorDetails = validationResult.error.issues
            .map((issue) => `${issue.path.join('.') || 'input'}: ${issue.message}`)
            .join('; ');
        throw new Error(`Validation error: ${errorDetails}`);
    }
    const res = validationResult.data;

    try {
       
        const existingResource = await prisma.resource.findFirst({
            where: {
                title: res.title,
                ownerId: res.ownerId, 
            },
        });

        if (existingResource) {
            throw new Error("Resource with this title already exists for this owner.");
        }

        const newResource = await prisma.resource.create({
            data: {
                title: res.title,
                description: res.description,
                category: res.category,
                imageUrl: res.imageUrl,
                isSharable: res.isSharable,
                //zoneId: res.zoneId,
               ownerId: res.ownerId, 
            },
        });
        console.log(`Resource created successfully: ID ${newResource.id}, Title: ${newResource.title}`);
        return newResource;
    } catch (error) {
        console.error(`Error in CreateResource: ${error.message}`);
        if (error.code === 'P2002') { 
            throw new Error(`A resource with similar attributes already exists (Constraint: ${error.meta.target.join(', ')}).`);
        }
        throw error;
    }
}


async function GetResourceByUsername(username) {
    if (!username) {
        throw new Error("Username cannot be empty for GetResourceByUsername");
    }
    try {
        const resources = await prisma.resource.findMany({
            where: {
                owner: { // Navigate through the relation to the User model
                    username: username
                }
            }
        });
 if (resources.length === 0) {
     throw new Error("No resources found for this username"); 
 }
        return resources;
    } catch (error) {
        console.error(`Error fetching resources by username (${username}): ${error.message}`);
        throw error;
    }
}

async function DeleteResource(id) {
    if (!id) {
        throw new Error("ID cannot be empty for DeleteResource");
    }
    try {
        const existing = await prisma.resource.findUnique({ where: { id } });
        if (!existing) {
            throw new Error(`Resource with ID ${id} not found for deletion.`);
        }
        const resource = await prisma.resource.delete({
            where: { id: id }
        });
        return resource; 
    } catch (error) {
        if (error.code === 'P2025') {
             throw new Error(`Resource with ID ${id} not found.`);
        }
        console.error(`Error deleting resource ID ${id}: ${error.message}`);
        throw error;
    }
}

async function UpdateResource(id, input) {
    if (!id) {
        throw new Error("ID cannot be empty for UpdateResource");
    }
    const validationResult = ResourceInputSchema.partial().safeParse(input); 
    if (!validationResult.success) {
        const errorDetails = validationResult.error.issues
            .map((issue) => `${issue.path.join('.') || 'input'}: ${issue.message}`)
            .join('; ');
        throw new Error(`Validation error during update: ${errorDetails}`);
    }
    const res = validationResult.data;

    if (Object.keys(res).length === 0) {
        throw new Error("No valid update data provided.");
    }

    try {
        const existing = await prisma.resource.findUnique({ where: { id } });
        if (!existing) {
            throw new Error(`Resource with ID ${id} not found for update.`);
        }

        const resource = await prisma.resource.update({
            where: { id: id },
            data: res 
        });
        return resource;
    } catch (error) {
        if (error.code === 'P2025') { 
             throw new Error(`Resource with ID ${id} not found.`);
        }
        console.error(`Error updating resource ID ${id}: ${error.message}`);
        throw error;
    }
}

async function GetResourceById(id) {
    if (!id) {
        throw new Error("ID cannot be empty for GetResourceById");
    }
    try {
        const resource = await prisma.resource.findUnique({
            where: { id: id }
        });
        if (!resource) {
            throw new Error(`Resource with ID ${id} not found.`);
        }
        return resource;
    } catch (error) {
        console.error(`Error fetching resource by ID ${id}: ${error.message}`);
        throw error;
    }
}

async function GetAllResources() {
    try {
        const resources = await prisma.resource.findMany();
        return resources;
    } catch (error) {
        console.error(`Error fetching all resources: ${error.message}`);
        throw error;
    }
}


async function GetResourceByZoneId(zoneId) {
    if (!zoneId) {
        throw new Error("Zone ID cannot be empty");
    }
    try {
        const resources = await prisma.resource.findMany({
            where: { zoneId: zoneId }
        });
        return resources;
    } catch (error) {
        console.error(`Error fetching resources by zone ID ${zoneId}: ${error.message}`);
        throw error;
    }
}

async function GetResourceByCategory(category) {
    if (!category) {
        throw new Error("Category cannot be empty");
    }
    try {
        const resources = await prisma.resource.findMany({
            where: { category: category }
        });
        return resources;
    } catch (error) {
        console.error(`Error fetching resources by category ${category}: ${error.message}`);
        throw error;
    }
}

async function GetResourceByOwnerId(ownerId) {
    if (!ownerId) {
        throw new Error("Owner ID cannot be empty");
    }
    try {
        const resources = await prisma.resource.findMany({
            where: { ownerId: ownerId }
        });
        return resources;
    } catch (error) {
        console.error(`Error fetching resources by owner ID ${ownerId}: ${error.message}`);
        throw error;
    }
}

async function GetResourceByTitle(title) {
    if (!title) {
        throw new Error("Title cannot be empty");
    }
    try {
        const resources = await prisma.resource.findMany({
            where: { title: { contains: title, mode: 'insensitive' } } 
        });
        return resources;
    } catch (error) {
        console.error(`Error fetching resources by title '${title}': ${error.message}`);
        throw error;
    }
}

async function GetResourceByDescription(description) {
    if (!description) {
        throw new Error("Description cannot be empty");
    }
    try {
        const resources = await prisma.resource.findMany({
            where: { description: { contains: description, mode: 'insensitive' } }
        });
        return resources;
    } catch (error) {
        console.error(`Error fetching resources by description: ${error.message}`);
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