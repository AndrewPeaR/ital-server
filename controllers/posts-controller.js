const postService = require('../services/posts-service')

class PostController {
    async createPost(req, res, next) {
        try {
            const newPost = await postService.createPost(req.body, req.user.id)
            res.redirect('/', {user: req.user})
        } catch(err) {
            next(err)
        }
    }
    async getOnePost(req, res, next) {
        try {
            const post = await postService.getOnePost(req.params.slug)
            console.log(post)
            res.render('post.ejs', {post: post})
        } catch(err) {
            next(err)
        }
    }
}

module.exports = new PostController()