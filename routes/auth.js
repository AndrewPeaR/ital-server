const Router = require("express").Router;
const router = new Router();

const AuthController = require('../controllers/auth-controller')

router.post('/register', AuthController.createUser)
router.post('/login', AuthController.loginUser)
router.get('/logout', AuthController.logout)

router.get('/login', (req, res) => {
    res.render('admin/login.ejs', {user: req.user})
})
router.get('/register', (req, res) => {
    res.render('admin/register.ejs', {user: req.user})
})

module.exports = router