
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')


class Member extends Model{

    static async addMember(){

    }

    static async joinGroup(groupId,uid){

        let isMember = await Member.findOne({
            where:uid
        })

        if(isMember){
            throw new Error("已经加入该小组，不可重估加入")
        }
        Member.create({
            groupId,
            uid
        })
    }

}


Member.init({
    uid:{type:Sequelize.INTEGER},
    groupId:{type:Sequelize.INTEGER}
},{ sequelize, tableName: 'groupMember' })


module.exports = {
    Member
}