const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')

class UserSavedCommunity extends Model{
    
}

UserSavedCommunity.init({
    uid:Sequelize.INTEGER,
    activity_id:Sequelize.INTEGER,
    type:Sequelize.INTEGER,
    groupId:Sequelize.INTEGER
}, { sequelize, tableName: 'userSavedCommunity' })

class UserSavedGroup extends Model{
    
}

UserSavedGroup.init({
    uid:Sequelize.INTEGER,

    groupId:Sequelize.INTEGER
}, { sequelize, tableName: 'userSavedGroup' })


module.exports = {

    UserSavedCommunity,
    UserSavedGroup
}