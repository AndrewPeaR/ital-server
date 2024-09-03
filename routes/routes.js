const Router = require('express').Router
const router = new Router()
const postsRouter = require('./posts')
const adminRouter = require('./admin')
const authRouter = require('./auth')
const { authCheck } = require('../controllers/auth-controller')

const bcrypt = require('bcrypt')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    const vendors = await prisma.Company.findMany({
        take: 3
    })
    const info = await prisma.about.findMany()
    res.render('pages/index.ejs', {vendors: vendors, info: info})
})
router.get('/about', async (req, res) => {
    const info = await prisma.about.findMany()
    res.render('pages/about.ejs', {info: info})
})
router.get('/vendors', (req, res) => res.render('pages/vendors.ejs'))
router.get('/contacts', (req, res) => res.render('pages/contacts.ejs'))
router.get('/vendors/:slug', async (req, res) => {
    const vendor = await prisma.Company.findUnique({
        where: {
            slug: req.params.slug
        }
    })
    vendor.CompanyTag = vendor.CompanyTag.split(', ')
    res.render('pages/company.ejs', {user: req.user, vendor: vendor})
})

router.get('/register', (req, res) => res.render('admin/register.ejs'))
router.post('/register', async (req, res) => {
    const passwordHash = await bcrypt.hash(req.body.password, 10)
    
    const newAdmin = await prisma.User.create({
        data: {
            email: req.body.email,
            passwordHash: passwordHash,
            firstname: req.body.name,
            lastname: 'Admin'
        }
    })
    res.redirect('/auth/login')
})



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