
const { Sequelize, Model,Op } = require('sequelize')
const sequelize = require('../../core/db')
const {User} = require('./user')
const {classifiedAccordingToKey} = require('../../utils/groupby')
class Member extends Model{

    static async deleteFromDepartment(memberInfo){
        let {groupId,uid} = memberInfo
        await Member.update({
            department:""
        },{
            where:{
                groupId:groupId,
                uid:uid
            }
        })
    }

    static async updateMemberDepartment(members,department){
        if(members.length){
            members.forEach(async member=>{
                await Member.update({
                    department
                },{
                    where:{
                        uid:member.uid,
                        groupId:member.groupId
                    }
                })
            })
        }
        
    }
    static async removeFromGroup(groupId,uid){
        let member = await Member.findOne({
            where:{
                groupId,
                uid
            }
        })
        if(!member){
            throw new global.errs.RemoveGroupError()
        }
        await member.destroy({
            force:true
        })
    }
    static async updateMember(groupMember){
        Object.keys(groupMember).forEach(department=>{
            let members = groupMember[department]
            members.forEach(async item=>{
                await Member.update({
                    ...item
                },{
                    where:{
                        id:item.id,
                        groupId:item.groupId,
                        uid:item.uid
                    }
                })
            })
            
        })
    }
    static async changeMemberAuth(groupId,memberId,auth,department,position){
        let auth_value = 0
        switch(auth){
            case "社长权限":
                auth_value = 16
                break
            case "部长权限":
                auth_value = 8
                break
            case "成员权限":
                auth_value = 4
                break

        }
        await Member.update({
            auth:auth_value,
            department,
            position
        },{
            where:{
                groupId,
                id:memberId
            }
        })
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
        members = members.map((member)=>{
            return Object.assign(member,userInfo.find(user=>user.id == member.uid))
        })
        return members
    }

    static async getGroupByMember(groupId){
        let peopleWithNoDepartment = []
        let members = await Member.findAll({
            where:{
                groupId
            },
            raw:true
        })
        let userIds = members.map(member=>{
            return member.uid
        })
        let users = await User.findAll({
            where:{
                id:{
                    [Op.in]:userIds
                }
            },
            raw:true,
            attributes:['avatar','nickName','id']
        })
        members = members.map((member)=>{
            let userInfo = users.find(item=>item.id === member.uid)
            return Object.assign(member,userInfo)
        })
        members = members.map((member)=>{
            let auth = member.auth
            if(auth == 16){
                return Object.assign(member,{auth:'社长权限'})
            }else if(auth == 8){
                return Object.assign(member,{auth:'部长权限'})
            }else{
                return Object.assign(member,{auth:'成员权限'})
            }
        })
        members = members.filter(item=>{
            if(!item.department){
                peopleWithNoDepartment.push(item)
            }
            return item.department
        })
        members = classifiedAccordingToKey(members,'department')
        return {members:members,peopleWithNoDepartment}
    }

    

}


Member.init({
    uid:{type:Sequelize.INTEGER},
    groupId:{type:Sequelize.INTEGER},
    department:{type:Sequelize.STRING},
    position:{type:Sequelize.STRING,defaultValue:"无"},
    auth:Sequelize.INTEGER
},{ sequelize, tableName: 'groupMember' })


module.exports = {
    Member
}