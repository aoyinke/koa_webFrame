
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')

const {Member} = require('./groupMember')
class GroupInfo extends Model {
    

    static async groupRegister(groupInfo){

        return await GroupInfo.create({
            ...groupInfo
        })

    }

    static async findGroupColleges(){
        return await GroupInfo.findAll({
            group:'college',
            attributes:['college'],
            raw:true
        })
    }

    static async getGroupInfo(groupId){
        return await GroupInfo.findOne({
            where:{
                id:groupId
            }
        })
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
    coverImg:{type:Sequelize.STRING},
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
module.exports = {
    GroupInfo,
    Applicant
}