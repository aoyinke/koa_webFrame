
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')



class Favor extends Model{

    static async userLikeIt(activity_id, type, uid) {
        const favor = await Favor.findOne({
            where: {
                activity_id,
                uid,
                type,
            }
        })
        return favor ? true : false
    }

    static async likeActivity(activity_id,type,uid){
        const favor = await Favor.findOne({
            where:{
                activity_id,
                type,
                uid
            }
        })
        if(favor){
            throw new global.errs.LikeError()
        }
        return sequelize.transaction(async t=>{
            await Favor.create({
                activity_id,
                type,
                uid
            },{transaction:t})
            let  {Community} = require('./community')
            const activity = await Community.getData(activity_id,type,false)
            await activity.increment('fav_nums',{
                by:1,
                transaction:t
            })
        })
    }

    static async dislikeActivity(activity_id,type,uid){
        const favor = await Favor.findOne({
            where:{
                activity_id,
                type,
                uid
            }
            
        })
        if(!favor){
            throw new global.errs.DislikeError()
        }
        return sequelize.transaction(async t=>{
            await favor.destroy({
                force:true,
                transaction:t
            })
            let  {Community} = require('./community')
            const activity = await Community.getData(activity_id,type,false)
            await activity.decrement('fav_nums',{
                by:1,
                transaction:t
            })
        })
    }

}


Favor.init({
    uid:Sequelize.INTEGER,
    activity_id:Sequelize.INTEGER,
    type:Sequelize.INTEGER,
}, { sequelize, tableName: 'favor' })

class NeedFavor extends Model{
    
    static async userLikeIt(needId, category, uid) {
        const favor = await NeedFavor.findOne({
            where: {
                needId,
                category,
                uid,
            }
        })
        return favor ? true : false
    }

    static async likeNeed(needId,category,uid){
        const need = await NeedFavor.findOne({
            where:{
                needId,
                category,
                uid
            }
        })
        if(need){
            throw new global.errs.NeedFavorError()
        }
        return sequelize.transaction(async t=>{
            await NeedFavor.create({
                needId,
                category,
                uid
            },{transaction:t})
            let  {Need} = require('./need')
            const needInfo = await Need.findNeed(needId,category)
            await needInfo.increment('fav_nums',{
                by:1,
                transaction:t
            })
        })
    }

    static async dislikeNeed(needId,category,uid){
        const need = await NeedFavor.findOne({
            where:{
                needId,
                category,
                uid
            }
            
        })
        if(!need){
            throw new global.errs.CancelNeedFavorError()
        }
        return sequelize.transaction(async t=>{
            await need.destroy({
                force:true,
                transaction:t
            })
            let  {Need} = require('./need')
            const needInfo = await Need.findNeed(needId,category)
            await needInfo.decrement('fav_nums',{
                by:1,
                transaction:t
            })
        })
    }
}

NeedFavor.init({
    uid:Sequelize.INTEGER,
    needId:Sequelize.INTEGER,
    category:Sequelize.STRING
}, { sequelize, tableName: 'needFavor' })

class UserFavor extends Model{
    
    static async userLikeIt(favor_uid,uid) {
        const favor = await UserFavor.findOne({
            where: {
                favor_uid,
                uid,
            }
        })
        return favor ? true : false
    }

    static async likeUser(favor_uid,uid){
        const need = await UserFavor.findOne({
            where:{
                favor_uid,
                uid
            }
        })
        if(need){
            throw new global.errs.NeedFavorError("已经收藏该用户")
        }
        return sequelize.transaction(async t=>{
            await UserFavor.create({
                favor_uid,
                uid
            },{transaction:t})
            let  {User} = require('./user')
            const userInfo = await User.getUserInfo(uid,false)
            await userInfo.increment('likeNums',{
                by:1,
                transaction:t
            })
        })
    }

    static async dislikeUser(favor_uid,uid){
        const need = await UserFavor.findOne({
            where:{
                favor_uid,
                uid
            }
            
        })
        if(!need){
            throw new global.errs.CancelNeedFavorError()
        }
        return sequelize.transaction(async t=>{
            await need.destroy({
                force:true,
                transaction:t
            })
            let  {User} = require('./user')
            const userInfo = await User.getUserInfo(uid)
            await userInfo.decrement('fav_nums',{
                by:1,
                transaction:t
            })
        })
    }
}

UserFavor.init({
    uid:Sequelize.INTEGER,
    favor_uid:Sequelize.INTEGER
    
}, { sequelize, tableName: 'userFavor' })


module.exports = {
    Favor,
    NeedFavor,
    UserFavor
}