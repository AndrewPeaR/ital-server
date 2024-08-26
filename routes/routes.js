const Router = require('express').Router
const router = new Router()
const postsRouter = require('./posts')
const adminRouter = require('./admin')
const authRouter = require('./auth')
const { authCheck } = require('../controllers/auth-controller')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


router.post('/create', async (req, res) => {
    const newQuestion = await prisma.Questions.create({
        data: {        
            name: req.body.name,
            phoneNumber: req.body.phone,
            email: req.body.email,
            question: req.body.message,
        }
    })
    res.redirect('/')
})

router.use('/auth', authRouter)
router.use('/posts', postsRouter)
router.use('/admin', authCheck, adminRouter)

module.exports = router