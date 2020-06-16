
const { Sequelize, Model,Op } = require('sequelize')
const sequelize = require('../../core/db')
const {defaultCoverImgs,basicUrl} = require('../../config/config')

const {Member} = require('./groupMember')
const {User} = require('./user')
const {GroupFavor} = require('./groupFavor')
const fs = require('fs')
class GroupInfo extends Model {
    
    static async getUserAuth(uid){
        let userGroups = await Member.findAll({
            where:{
                uid
            },
            raw:true,
            attributes:['auth','groupId','uid']
        })
        let res = []
        let groupIds = userGroups.map(item=>{
            return item.groupId
        })
        let groupInfoList = await GroupInfo.findAll({
            where:{
                id:{
                    [Op.in]:groupIds
                }
            },
            raw:true,
            attributes:['id','groupName']
        })
        userGroups.forEach(group=>{
            let groupInfo = groupInfoList.find(item=> item.id === group.groupId)
            res.push(Object.assign(group,groupInfo))
        })
        return res
    }

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
                    department:"社长团",
                    position:"社长",
                    auth:16
                },{transaction:t})
                defaultCoverImgs.forEach(async url=>{
                    await GroupCoverImgs.create({
                        groupId:group.id,
                        url
                    })
                },{transaction:t})
                return group
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

    static async getGroupInfo(groupId,uid){
        let fav_status = await GroupFavor.userLikeIt(groupId,uid)
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
        groupInfo.fav_status = fav_status
        return groupInfo
    }

    static async getGroupInfoByName(groupName){
        let groupInfo =  await GroupInfo.findOne({
            where:{
                groupName
            },
            raw:true
        })
        let coverImgs = await GroupCoverImgs.findAll({
            where:{
                groupId:groupInfo.id
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
        if(applicants.length){
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
        return []
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

    static async approveJoinGroup(memberInfo){

        

        return sequelize.transaction(async t=>{
            await Applicant.destroy({
                where:{
                    groupId:memberInfo.groupId,
                    uid:memberInfo.uid
                    
                },
                force:true,
                transaction:t
            })
            await Member.create({
                ...memberInfo,
                auth:4
            },{transaction:t})
            
        })
    }

    static async declineJoinGroup(memberInfo){

            await Applicant.destroy({
                where:{
                    groupId:memberInfo.groupId,
                    uid:memberInfo.uid
                    
                },
                force:true
            })
            
    }
}

Applicant.init({
    groupId:Sequelize.STRING,
    reason:Sequelize.STRING,
    uid:Sequelize.INTEGER
}, { sequelize, tableName: 'applicant' })


class GroupCoverImgs extends Model{
    static async deleteGroupCoverImg(groupId,url){
        let img = await GroupCoverImgs.findOne({
            where:{
                groupId,
                url
            }
        })

        if(!img){
            throw new global.errs.CoverImgError()
        }

        let pathUrl = url.replace(basicUrl,'')
        if(pathUrl.startsWith('static')){
            await img.destroy({
                force:true

            })
            return
        }else{
            return sequelize.transaction(async t=>{
                await img.destroy({
                    force:true,
                    transaction:t
                })  
                fs.unlinkSync(pathUrl)
                
            })
        }
        
    }
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