const Router = require("express").Router;
const router = new Router();

const QuestionsController = require('../controllers/questions-controller')
const PostsController = require('../controllers/posts-controller')
const AdminController = require('../controllers/admin-controller')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



router.get('/', (req, res) => {
    res.render('admin.ejs',{user: req.user})
})

router.get('/questions', QuestionsController.getAllQuestions)
router.get("/questions/apply/:id", async (req, res) => {
    if (req.user?.email) {
      const question = await prisma.Questions.findUnique({
        where: {
          id: Number(req.params.id),
        },
      });
      const countQuestions = await prisma.Questions.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          status: !question.status,
        },
      });
      res.redirect("/admin/questions");
    } else {
      res.redirect("/admin/questions");
    }
  });
  router.get("/questions/delete/:id", async (req, res) => {
    if (req.user?.email) {
      const countQuestions = await prisma.Questions.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      res.redirect("/admin/questions");
    } else {
      res.redirect("/admin/questions");
    }
  });


router.post('/create', PostsController.createPost)

module.exports = router