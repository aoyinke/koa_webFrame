
const { Sequelize, Model,Op } = require('sequelize')
const sequelize = require('../../core/db')
const {defaultCoverImgs} = require('../../config/config')
const {Member} = require('./groupMember')
const {User} = require('./user')
class GroupInfo extends Model {
    

    static async groupRegister(groupInfo,uid){

        let isGroup = await GroupInfo.findOne({
            where:{
                college:groupInfo.college,
                groupName:groupInfo.groupName
            }
        })
        if(!isGroup){
            return sequelize.transaction(async t=>{
                const group = await GroupInfo.create({
                    ...groupInfo
                    
                },{transaction:t})
                await Member.create({
                    uid,
                    groupId:group.id,
                    dapartment:"社长团",
                    position:"社长",
                    auth:16
                },{transaction:t})
                defaultCoverImgs.forEach(async url=>{
                    await GroupCoverImgs.create({
                        groupId:group.id,
                        url
                    })
                },{transaction:t})
            })
        }else{
            throw new global.errs.GroupRegisterError()
        }
        
        

    }

    static async findGroupColleges(){
        return await GroupInfo.findAll({
            group:'college',
            attributes:['college'],
            raw:true
        })
    }

    static async findUserGroup(uid){
        let groupList = await Member.findAll({
            where:{
                uid
            },
            attributes:['groupId'],
            raw:true
        })
        let ids = groupList.map(group=>{
            return group.groupId

        })
        let groups = await GroupInfo.findAll({
            where:{
                id: {
                    [Op.in]: ids
                },
            },
            attributes:['groupName','logo','description','tags',"category",'id'],
            raw:true
        })
        let userGroups = groups.map((group)=>{
            let {groupName,logo,description,tags,category} = group
            return {groupName,groupId:ids.find(id=>group.id == id),logo,description,tags,category}
        })
        return userGroups

    }

    static async getGroupInfo(groupId){
        let groupInfo =  await GroupInfo.findOne({
            where:{
                id:groupId
            },
            raw:true
        })
        let coverImgs = await GroupCoverImgs.findAll({
            where:{
                groupId
            },
            attributes:['url']
        })
        groupInfo.coverImgs = coverImgs.map(item=>{
            return item.url
        })
        return groupInfo
    }

    
    
}


GroupInfo.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    groupName:{type:Sequelize.STRING},
    college:Sequelize.STRING,
    description:{type:Sequelize.STRING},
    logo:{type:Sequelize.STRING},
    category:{type:Sequelize.STRING},   
    startTime:{type:Sequelize.DATEONLY},
    tags:{type:Sequelize.STRING,defaultValue:"优秀,团结"},
    fav_nums:{type:Sequelize.INTEGER,defaultValue:0},
    good_nums:{type:Sequelize.INTEGER,defaultValue:0},
    concat:{type:Sequelize.STRING,defaultValue:'没有联系方式的话，小伙伴们会找不到你们哦/(ㄒoㄒ)/~~'},
    achievements:{type:Sequelize.STRING,defaultValue:"赶快编辑属于咱们的荣誉墙吧！"},
    specialActivity:{type:Sequelize.STRING,defaultValue:"赶快编辑属于咱们的特色活动吧！"},
}, { sequelize, tableName: 'groupInfo' })



class Applicant extends Model{
    static async getApplicantList(groupId){
        groupId = parseInt(groupId)
        let applicants = await Applicant.findAll({
            where:{
                groupId
            },
            raw:true
        })
        let uid_list =  applicants.map(applicant=>{
            return applicant.uid 
        })
        let users = await User.findAll({
            where:{
                id: {
                    [Op.in]: uid_list
                }
            },
            raw:true,
            attributes:['nickName','avatar','id']
        
        })
        applicants = applicants.map((item,index)=>{
            return Object.assign(item,users.find((user)=>user.id == item.uid))
        })

        return applicants
    }

    static async handleSubmit(groupId,reason,uid){
        let handleSubmit = await Applicant.findOne({
            where:{
                groupId:groupId,
                uid
            }
        })
        let member = await Member.findOne({
            where:{
                groupId:groupId,
                uid
            }
        })
        if(handleSubmit){
            throw new global.errs.SubmitError()
        }else if( !handleSubmit && member){
            throw new global.errs.SubmitError("你已经是成员，不可重复加入")
        }
        await Applicant.create({
            uid,
            reason,
            groupId
        })
    }

    static async approveJoinGroup(memberInfo,uid){

        

        return sequelize.transaction(async t=>{
            await Applicant.destroy({
                where:{
                    groupId:memberInfo.groupId,
                    uid
                    
                },
                force:true,
                transaction:t
            })
            await Member.create({
                uid,
                ...memberInfo
            },{transaction:t})
            
        })
    }
}

Applicant.init({
    groupId:Sequelize.STRING,
    reason:Sequelize.STRING,
    uid:Sequelize.INTEGER
}, { sequelize, tableName: 'applicant' })


class GroupCoverImgs extends Model{

}

GroupCoverImgs.init({
    groupId:Sequelize.INTEGER,
    url:Sequelize.STRING
}, { sequelize, tableName: 'groupCoverImgs' })


module.exports = {
    GroupInfo,
    Applicant,
    GroupCoverImgs
}