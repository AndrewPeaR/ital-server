const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



class PostsService {
    async createPost(postInfo, userId){
        const newPost = await prisma.Post.create({
            data: {        
                title: postInfo.title,
                description: postInfo.description,
                author_id: userId,
                slug: slugify(postInfo.title, {lower: true, strict: true}),
                sanitizedHtml: dompurify.sanitize(postInfo.mytextarea)
            }
        })
        return newPost
    }
    async getOnePost(postSlug){
        const post = await prisma.Post.findUnique({
            where: {
                slug: postSlug
            },
            include: {
                author: true
            }
        })
        return post
    }
}

module.exports = new PostsService()