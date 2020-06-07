const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')

class UserSavedCommunity extends Model{
    
}

UserSavedCommunity.init({
    uid:Sequelize.INTEGER,
    acitivity_id:Sequelize.INTEGER,
    type:Sequelize.INTEGER,
    groupId:Sequelize.INTEGER
}, { sequelize, tableName: 'userSavedCommunity' })


module.exports = {

    UserSavedCommunity
}