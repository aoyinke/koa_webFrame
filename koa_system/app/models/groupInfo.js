
const { Sequelize, Model,Op } = require('sequelize')
const sequelize = require('../../core/db')

const {Member} = require('./groupMember')
class GroupInfo extends Model {
    

    static async groupRegister(groupInfo,uid){

        // return sequelize.transaction(async t=>{
        //     await Favor.create({
        //         activity_id,
        //         type,
        //         uid
        //     },{transaction:t})
        //     const activity = await Community.getData(activity_id,type)
        //     await activity.increment('fav_nums',{
        //         by:1,
        //         transaction:t
        //     })
        // })
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
                    dapatment:"未知",
                    poisition:"社长"
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
            attributes:['groupName'],
            raw:true
        })
        let userGroups = groups.map((group,index)=>{
            return {groupName:group.groupName,groupId:ids[index]}
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
        }) || []
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
    tags:{type:Sequelize.STRING,defaultValue:"优秀,"},
    fav_nums:{type:Sequelize.INTEGER,defaultValue:0},
    good_nums:{type:Sequelize.INTEGER,defaultValue:0},
    concat:{type:Sequelize.STRING,defaultValue:'没有联系方式的话，小伙伴们会找不到你们哦/(ㄒoㄒ)/~~'},
    achievements:{type:Sequelize.STRING,defaultValue:"赶快编辑属于咱们的荣誉墙吧！"},
    specialActivity:{type:Sequelize.STRING,defaultValue:"赶快编辑属于咱们的特色活动吧！"},
}, { sequelize, tableName: 'groupInfo' })



class Applicant extends Model{


    static async handleSubmit(handleInfo,uid){
        let handleSubmit = await Applicant.findOne({
            where:{
                groupId:handleInfo.groupId,
                uid

            }
        })
        let member = await Member.findOne({
            where:{
                groupId:handleInfo.groupId,
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
            ...handleInfo
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
    avatar:Sequelize.STRING,
    nickName:Sequelize.STRING,
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