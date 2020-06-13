const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')

class UserSavedCommunity extends Model{
    
    static async saveCommunity(communityInfo,uid){
        let {activity_id,type} = communityInfo
        let saved = await UserSavedCommunity.findOne({
            where:{
                activity_id:activity_id,
                type:type
            }
        })
        if(saved){
            throw new global.errs.SaveError()
        }
        return sequelize.transaction(async t=>{
            await UserSavedCommunity.create({
                ...communityInfo,
                uid

            },{transaction:t})
            let  {Community} = require('./community')
            const activity = await Community.getData(activity_id,type,false)
            await activity.increment('like_nums',{
                by:1,
                transaction:t
            })
        })
    }


    static async cancelSavedCommunity(communityInfo){
        let {activity_id,type} = communityInfo
        let saved = await UserSavedCommunity.findOne({
            activity_id:activity_id,
            type:type
        })
        if(!saved){
            throw new global.errs.CancelSaveError()
        }
        return sequelize.transaction(async t=>{
            await saved.destroy({
                force:true,
                transaction:t
            })
            let  {Community} = require('./community')
            const activity = await Community.getData(activity_id,type,false)
            await activity.decrement('like_nums',{
                by:1,
                transaction:t
            })
        })
    }

    static async userSaveIt(activity_id, type, uid) {
        const saved = await UserSavedCommunity.findOne({
            where: {
                activity_id,
                uid,
                type,
            }
        })
        return saved ? true : false
    }

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