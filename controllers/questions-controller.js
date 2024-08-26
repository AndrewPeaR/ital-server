const QuestionsService = require('../services/questions-service')

class QuestionsController {
    async getAllQuestions(req, res) {
        const questions = await QuestionsService.getAllQuestions()
        res.render('admin/questions.ejs', {user: req.user, questions: questions})
    }
}

module.exports = new QuestionsController()