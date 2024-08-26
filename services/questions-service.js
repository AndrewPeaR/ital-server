const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class QuestionsService {
    async getAllQuestions(){
        const questions = await prisma.Questions.findMany({
            orderBy: {
                id: 'desc'
            }
        })
        return questions
    }
}

module.exports = new QuestionsService()