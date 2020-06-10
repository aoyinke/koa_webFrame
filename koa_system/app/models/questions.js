const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')


class UserQuestion extends Model{
    
}


UserQuestion.init({
    uid:Sequelize.INTEGER,
    content:Sequelize.STRING,
    score:Sequelize.INTEGER,
    contact:Sequelize.STRING
}, { sequelize, tableName: 'userQuestion' })


class UserQuestionImg extends Model{

}

UserQuestionImg.init({
    questionId:Sequelize.INTEGER,
    url:Sequelize.STRING
}, { sequelize, tableName: 'userQuestionImg' })

module.exports = {
    UserQuestion,
    UserQuestionImg
} 