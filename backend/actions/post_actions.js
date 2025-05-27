const {PrismaClient} = require('@prisma/client');
const prisma=new PrismaClient();
const {z, any} = require('zod');

const PostInputSchema = z.object({
    content: z.string().min(0).default(0).nullable(),
    imageUrl: z.string().url('Invalid URL format').nullable(),
    authorId: z.string(),
    //zoneId: z.string().nullable().optional(),
});
async function incrementLikes(postId) {
    try {
        const post = await prisma.post.update({
            where: { id: postId },
            data: { likes: { increment: 1 } },
        });
        return post;
    } catch (error) {
        console.error(`Error incrementing likes for post ID ${postId}: ${error.message}`);
        throw new Error(`Error incrementing likes: ${error.message}`);
    }
}

async function incrementDislikes(postId) {
    try {
        const post = await prisma.post.update({
            where: { id: postId },
            data: { dislikes: { increment: 1 } },
        });
        return post;
    } catch (error) {
        console.error(`Error incrementing dislikes for post ID ${postId}: ${error.message}`);
        throw new Error(`Error incrementing dislikes: ${error.message}`);
    }
}

async function CreatePost(input) {
    const validationResdult=PostInputSchema.safeParse(input);
    if(!validationResdult.success){
        const errorDetails=validationResdult.error.issues
        .map((issue)=>`${issue.path.join('.')||'input'}: ${issue.message}`)
        .join('; ');
        throw new Error(`Validation error: ${errorDetails}`);
    }
    const res=validationResdult.data;
    try {
        const post=await prisma.post.create({
            data:{
                content: res.content,
                imageUrl: res.imageUrl,
                authorId: res.authorId,
             //  zoneId: res.zoneId,
            },
        })
        console.log(`Post created successfully: ID ${post.id}, Content: ${post.content}`);
        return post;
    } catch (error) {
        console.error(`Error in CreatePost: ${error.message}`);
        if (error.code === 'P2002') {
            throw new Error(`A post with similar attributes already exists (Constraint: ${error.meta.target.join(', ')}).`);
        } else {
            throw new Error(`Error creating post: ${error.message}`);
        }
    }

}
async function GetPostById(id) {
    try {
        const post = await prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            throw new Error(`Post with ID ${id} not found`);
        }
        return post;
    } catch (error) {
        console.error(`Error in GetPostById: ${error.message}`);
        throw new Error(`Error retrieving post: ${error.message}`);
    }
}
async function GetPostsByAuthorId(authorId) {
    try {
        const posts = await prisma.post.findMany({
            where: { authorId },
        });
        if (posts.length === 0) {
            throw new Error(`No posts found for author with ID ${authorId}`);
        }
        return posts;
    } catch (error) {
        console.error(`Error in GetPostsByAuthorId: ${error.message}`);
        throw new Error(`Error retrieving posts: ${error.message}`);
    }
}
async function GetPostsByZoneId(zoneId) {
    try {
        const posts = await prisma.post.findMany({
            where: { zoneId },
        });
        if (posts.length === 0) {
            throw new Error(`No posts found for zone with ID ${zoneId}`);
        }
        return posts;
    } catch (error) {
        console.error(`Error in GetPostsByZoneId: ${error.message}`);
        throw new Error(`Error retrieving posts: ${error.message}`);
    }
}
async function deletePost(id) {
    try {
        const existing = await prisma.post.findUnique({ where: { id } });
        if (!existing) {
            throw new Error(`Post with ID ${id} not found for deletion.`);
        }
        const post = await prisma.post.delete({
            where: { id: id }
        });
        return post;
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error(`Post with ID ${id} not found.`);
        }
        console.error(`Error deleting post ID ${id}: ${error.message}`);
        throw error;
    }
}
async function updatePost(id, input) {
    const validationResult = PostInputSchema.safeParse(input);
    if (!validationResult.success) {
        const errorDetails = validationResult.error.issues
            .map((issue) => `${issue.path.join('.') || 'input'}: ${issue.message}`)
            .join('; ');
        throw new Error(`Validation error: ${errorDetails}`);
    }
    const res = validationResult.data;
    try {
        const existing = await prisma.post.findUnique({ where: { id } });
        if (!existing) {
            throw new Error(`Post with ID ${id} not found for update.`);
        }
        const post = await prisma.post.update({
            where: { id: id },
            data: res
        });
        return post;
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error(`Post with ID ${id} not found.`);
        }
        console.error(`Error updating post ID ${id}: ${error.message}`);
        throw error;
    }
}
async function getAllPosts({ take = 10, skip = 0 }) {
    try {
        const posts = await prisma.post.findMany({
            take,
            skip,
        });
        return posts;
    } catch (error) {
        logError('getAllPosts', error);
        throw new Error(`Error retrieving posts: ${error.message}`);
    }
}

async function getPostsByUsername(username) {
    try {
        const posts = await prisma.post.findMany({
            where: { author: { username } },
        });
        if (posts.length === 0) {
            throw new Error(`No posts found for user with username ${username}`);
        }
        return posts;
    } catch (error) {
        console.error(`Error in getPostsByUsername: ${error.message}`);
        throw new Error(`Error retrieving posts: ${error.message}`);
    }
}
async function decrementLikes(postId) {
    try {
        const post = await prisma.post.update({
            where: { id: postId },
            data: { likes: { decrement: 1 } },
        });
        return post;
    } catch (error) {
        console.error(`Error decrementing likes for post ID ${postId}: ${error.message}`);
        throw new Error(`Error decrementing likes: ${error.message}`);
    }
}

async function decrementDislikes(postId) {
    try {
        const post = await prisma.post.update({
            where: { id: postId },
            data: { dislikes: { decrement: 1 } },
        });
        return post;
    } catch (error) {
        console.error(`Error decrementing dislikes for post ID ${postId}: ${error.message}`);
        throw new Error(`Error decrementing dislikes: ${error.message}`);
    }
}



module.exports = {
    CreatePost,
    GetPostById,
    GetPostsByAuthorId,
    GetPostsByZoneId,
    deletePost,
    updatePost,
    getAllPosts,
    getPostsByUsername,
    incrementLikes,
    incrementDislikes,
    decrementLikes,
    decrementDislikes,

};