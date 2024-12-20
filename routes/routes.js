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
    const mainVendors = ['huawei', 'xfusion', 'dell', 'lenovo', 'mellanox', 'brocade', 'cisco', 'juniper']
    const vendors = await prisma.Company.findMany({
        // take: 4
        where: {
            slug: {
                in: mainVendors
            }
        }
    })
    const huaweiIndex = vendors.map(e => e.slug).indexOf('huawei')
    const xfusionIndex = vendors.map(e => e.slug).indexOf('xfusion')
    const huaweiElement = vendors.splice(huaweiIndex, 1)
    vendors.splice(0, 0, huaweiElement[0])
    const xfusionElement = vendors.splice(xfusionIndex, 1)
    vendors.splice(1, 0, xfusionElement[0])
    const customers = await prisma.Customers.findMany()
    const info = await prisma.about.findMany()
    res.render('pages/index.ejs', {vendors: vendors, info: info, customers: customers})
})
router.get('/about', async (req, res) => {
    const info = await prisma.about.findMany()
    res.render('pages/about.ejs', {info: info})
})
router.get('/vendors', async (req, res) => {
    const vendors = await prisma.Company.findMany()
    res.render('pages/vendors.ejs', {vendors: vendors})
})
router.get('/contacts', async (req, res) => {
    const photos = await prisma.OfficePhoto.findMany()
    const office = await prisma.About.findFirst({
        where: {
            slug: 'contacts-photo'
        }
    })
    res.render('pages/contacts.ejs', {photos: photos, office: office})
})
router.get('/vendors/:slug', async (req, res, next) => {
    const vendor = await prisma.Company.findUnique({
        where: {
            slug: req.params.slug
        },
        include: {
            companyBlocks: {
                include: {
                    products: true
                }
            }
        }
    })
    if(vendor){
        vendor.CompanyTag = vendor.CompanyTag.split(', ')
        res.render('pages/company.ejs', {user: req.user, vendor: vendor})
    }
    else{
        next()
    }
})

// router.get('/register', (req, res) => res.render('admin/register.ejs'))
// router.post('/register', async (req, res) => {
//     const passwordHash = await bcrypt.hash(req.body.password, 10)
    
//     const newAdmin = await prisma.User.create({
//         data: {
//             email: req.body.email,
//             passwordHash: passwordHash,
//             firstname: req.body.name,
//             lastname: 'Admin'
//         }
//     })
//     res.redirect('/auth/login')
// })



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