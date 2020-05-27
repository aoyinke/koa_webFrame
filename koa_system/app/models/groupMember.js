
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')


class Member extends Model{

    static async addMember(){

    }

    

}


Member.init({
    uid:{type:Sequelize.INTEGER},
    groupId:{type:Sequelize.INTEGER},
    department:Sequelize.STRING,
    poisition:Sequelize.STRING,
    avatar:Sequelize.STRING,
    nickName:Sequelize.STRING,
    groupName:Sequelize.STRING,
},{ sequelize, tableName: 'groupMember' })


module.exports = {
    Member
}