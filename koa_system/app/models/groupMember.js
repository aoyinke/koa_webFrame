
const { Sequelize, Model,Op } = require('sequelize')
const sequelize = require('../../core/db')
const {User} = require('./user')

class Member extends Model{

    static async addMember(){

    }

    static async findMember(groupId){
        let members = await Member.findAll({
            where:{
                groupId
            },
            raw:true
        })
        let userIds = members.map(member=>{
            return member.uid
        })
        let userInfo = await User.findAll({
            where:{
                id:{
                    [Op.in]:userIds
                }
            },
            raw:true,
            attributes:['avatar','nickName','id']
        })
        members = members.map((member,index)=>{
            return Object.assign(member,userInfo[index])
        })
        return members
    }

    

}


Member.init({
    uid:{type:Sequelize.INTEGER},
    groupId:{type:Sequelize.INTEGER},
    department:Sequelize.STRING,
    poisition:Sequelize.STRING,
    
},{ sequelize, tableName: 'groupMember' })


module.exports = {
    Member
}