const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')

class Answer extends Model{

}

Answer.init({
    
}, { sequelize, tableName: 'answer' })