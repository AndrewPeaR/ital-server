const Router = require("express").Router;
const router = new Router();

const PostsController = require('../controllers/posts-controller')

router.get('/:slug', PostsController.getOnePost)

module.exports = router