const { prisma } = require('../lib/db'); 
const { z } = require('zod');

const UserInputSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email format'),
    passwordHash: z.string().min(1, 'Password hash is required'),
    bio: z.string().optional(),
    addressString: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    isAddressVerified: z.boolean().default(false),
    //zoneId: z.string().optional(),
});

async function RegisterUser(input) {
    const validationResult = UserInputSchema.safeParse(input);
    if (!validationResult.success) {
        throw new Error(
            `Validation error: ${validationResult.error.issues
                .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                .join(', ')}`
        );
    }

    const validatedData = validationResult.data;

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                email: validatedData.email,
            },
        });

        if (existingUser) {
            if (existingUser.email === validatedData.email) {
                throw new Error("User with this email already exists");
            }
            if (existingUser.username === validatedData.username) {
                throw new Error("User with this username already exists");
            }
            throw new Error("User with this email or username already exists");
        }

        const newUser = await prisma.user.create({
            data: {
                username: validatedData.username,
                email: validatedData.email,
                passwordHash: validatedData.passwordHash,
                bio: validatedData.bio,
                addressString: validatedData.addressString,
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
                isAddressVerified: validatedData.isAddressVerified,
                //zoneId: validatedData.zoneId,
            },
        });
        console.log(`User registered successfully: ${newUser.email}`); // Add logging

        return newUser; // Return the created user object

    } catch (error) {
        console.error("Error during user registration:", error);

      

        throw new Error("An error occurred while registering the user. Please try again later.");
    }
}

async function DeleteUser(username) {
    if (!email || typeof email !== 'string') { 
        throw new Error("A valid email string is required to delete a user");
    }

    try {
        const userExists = await prisma.user.findUnique({
            where: { username },
            select: { id: true }, 
        });

        if (!userExists) {
            throw new Error(`User with email "${username}" not found.`);
        }

        const deletedUser = await prisma.user.delete({
            where: { username },
        });

        console.log(`Successfully deleted user with username: ${username}`); 
        return deletedUser;

    } catch (error) {
        console.error(`Error deleting user with usernmae ${username}:`, error); 

        if (error.message.includes("not found")) {
            throw error; 
        }
        throw new Error(`An error occurred while deleting the user with email ${email}.`);
    }
}

module.exports = { RegisterUser, DeleteUser };
